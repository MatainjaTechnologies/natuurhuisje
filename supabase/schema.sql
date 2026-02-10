-- Create extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Set up storage for listing images
INSERT INTO storage.buckets (id, name, public) VALUES ('listing_images', 'listing_images', true);
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'listing_images');
CREATE POLICY "Authenticated users can upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'listing_images' AND auth.role() = 'authenticated');
CREATE POLICY "Owners can update and delete" ON storage.objects USING (bucket_id = 'listing_images' AND auth.uid() = owner) WITH CHECK (bucket_id = 'listing_images' AND auth.uid() = owner);

-- User profiles table
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    email TEXT NOT NULL,
    phone TEXT,
    is_host BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profile policies
CREATE POLICY "Users can view any profile" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create function to handle new user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO profiles (id, first_name, last_name, email)
    VALUES (new.id, '', '', new.email);
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user creation
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Listing types
CREATE TYPE property_type AS ENUM ('cabin', 'treehouse', 'glamping', 'tiny-house', 'farm', 'other');

-- Listing amenities types using array instead of separate join table for simplicity
CREATE TYPE amenity AS ENUM ('wifi', 'pets', 'fireplace', 'pool', 'hot-tub', 'bbq', 'lake', 
                            'mountain-view', 'beachfront', 'secluded', 'forest');

-- Listings table
CREATE TABLE listings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    host_id UUID NOT NULL REFERENCES profiles(id),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    description TEXT NOT NULL,
    property_type property_type NOT NULL,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    lat NUMERIC(10, 6),
    lng NUMERIC(10, 6),
    price_per_night INTEGER NOT NULL,
    min_nights INTEGER DEFAULT 1,
    max_guests INTEGER NOT NULL,
    bedrooms INTEGER NOT NULL,
    beds INTEGER NOT NULL,
    bathrooms NUMERIC(3, 1) NOT NULL,
    amenities amenity[] DEFAULT '{}',
    images TEXT[] NOT NULL,
    is_published BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT price_check CHECK (price_per_night >= 0)
);

-- Create function to generate slug
CREATE OR REPLACE FUNCTION generate_slug() RETURNS TRIGGER AS $$
BEGIN
    NEW.slug := LOWER(REGEXP_REPLACE(NEW.title, '[^a-zA-Z0-9]', '-', 'g')) || '-' || SUBSTRING(NEW.id::text, 1, 8);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to generate slug before insert
CREATE TRIGGER before_insert_listings
    BEFORE INSERT ON listings
    FOR EACH ROW EXECUTE FUNCTION generate_slug();

-- Enable RLS on listings
ALTER TABLE listings ENABLE ROW LEVEL SECURITY;

-- Listing policies
CREATE POLICY "Anyone can view published listings" ON listings 
    FOR SELECT USING (is_published = TRUE);

CREATE POLICY "Hosts can view their own unpublished listings" ON listings 
    FOR SELECT USING (host_id = auth.uid());

CREATE POLICY "Hosts can insert their own listings" ON listings 
    FOR INSERT WITH CHECK (host_id = auth.uid());

CREATE POLICY "Hosts can update their own listings" ON listings 
    FOR UPDATE USING (host_id = auth.uid());

CREATE POLICY "Hosts can delete their own listings" ON listings 
    FOR DELETE USING (host_id = auth.uid());

-- Create booking status enum
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    listing_id UUID NOT NULL REFERENCES listings(id),
    guest_id UUID NOT NULL REFERENCES profiles(id),
    check_in_date DATE NOT NULL,
    check_out_date DATE NOT NULL,
    guest_count INTEGER NOT NULL,
    total_price INTEGER NOT NULL,
    status booking_status NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT valid_dates CHECK (check_out_date > check_in_date)
);

-- Enable RLS on bookings
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Booking policies
CREATE POLICY "Guests can view their own bookings" ON bookings 
    FOR SELECT USING (guest_id = auth.uid());

CREATE POLICY "Hosts can view bookings for their listings" ON bookings 
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM listings 
            WHERE listings.id = bookings.listing_id 
            AND listings.host_id = auth.uid()
        )
    );

CREATE POLICY "Guests can insert their own bookings" ON bookings 
    FOR INSERT WITH CHECK (guest_id = auth.uid());

CREATE POLICY "Guests can update their own pending bookings" ON bookings 
    FOR UPDATE USING (guest_id = auth.uid() AND status = 'pending');

-- Favorites table
CREATE TABLE favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id),
    listing_id UUID NOT NULL REFERENCES listings(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, listing_id)
);

-- Enable RLS on favorites
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Favorites policies
CREATE POLICY "Users can view their own favorites" ON favorites 
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own favorites" ON favorites 
    FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own favorites" ON favorites 
    FOR DELETE USING (user_id = auth.uid());

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID NOT NULL REFERENCES bookings(id),
    reviewer_id UUID NOT NULL REFERENCES profiles(id),
    listing_id UUID NOT NULL REFERENCES listings(id),
    rating INTEGER NOT NULL,
    comment TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    CONSTRAINT rating_range CHECK (rating >= 1 AND rating <= 5),
    UNIQUE(booking_id)
);

-- Enable RLS on reviews
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;

-- Review policies
CREATE POLICY "Anyone can view reviews" ON reviews 
    FOR SELECT USING (true);

CREATE POLICY "Guests can insert reviews for their completed bookings" ON reviews 
    FOR INSERT WITH CHECK (
        reviewer_id = auth.uid() AND
        EXISTS (
            SELECT 1 FROM bookings 
            WHERE bookings.id = reviews.booking_id
            AND bookings.guest_id = auth.uid()
            AND bookings.status = 'completed'
        )
    );

CREATE POLICY "Reviewers can update their own reviews" ON reviews 
    FOR UPDATE USING (reviewer_id = auth.uid());

-- Add average rating to listings
ALTER TABLE listings ADD COLUMN avg_rating NUMERIC(3, 2);

-- Function to update listing average rating
CREATE OR REPLACE FUNCTION update_listing_rating()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE listings 
    SET avg_rating = (
        SELECT AVG(rating)::NUMERIC(3, 2)
        FROM reviews
        WHERE listing_id = NEW.listing_id
    )
    WHERE id = NEW.listing_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update listing rating
CREATE TRIGGER after_review_change
    AFTER INSERT OR UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_listing_rating();
