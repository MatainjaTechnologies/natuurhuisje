# Natuurhuisje

A full-featured nature stay marketplace built with Next.js, TypeScript, Tailwind CSS, and Supabase.

![Natuurhuisje](/public/images/readme-hero.png)

## Features

- ✅ Modern tech stack: Next.js 15+, TypeScript, Tailwind CSS, Supabase
- ✅ User authentication with email/password and social login
- ✅ Property listings with detailed information and image gallery
- ✅ Search functionality with filters (location, dates, guests, property type)
- ✅ Booking system with confirmation and management
- ✅ User dashboard for managing bookings and favorites
- ✅ Host dashboard for property management
- ✅ Responsive design for all devices
- ✅ Server actions for data handling
- ✅ Database schema with proper relationships

## Tech Stack

- **Frontend**:
  - Next.js 15+ with App Router
  - TypeScript for type safety
  - Tailwind CSS for styling
  - Lucide React for icons
  - Radix UI primitives for accessible components

- **Backend**:
  - Supabase for authentication, database, and storage
  - Server Actions for data mutations
  - Zod for validation

## Getting Started

### Prerequisites

- Node.js 20+
- npm or yarn
- Supabase account

### Setup

1. Clone the repository

```bash
git clone https://github.com/yourusername/natuurhuisje.git
cd natuurhuisje
```

2. Install dependencies

```bash
npm install
# or
yarn install
```

3. Set up environment variables

Create a `.env.local` file in the root directory with the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. Set up Supabase

- Create a new project in [Supabase](https://supabase.com)
- Set up the following tables in your Supabase database:

### Database Schema

#### profiles

```sql
create table profiles (
  id uuid references auth.users not null primary key,
  first_name text,
  last_name text,
  phone_number text,
  avatar_url text,
  bio text,
  is_host boolean default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Users can view all profiles" on profiles
  for select using (true);

create policy "Users can update their own profile" on profiles
  for update using (auth.uid() = id);

create policy "User can insert their own profile" on profiles
  for insert with check (auth.uid() = id);
```

#### listings

```sql
create table listings (
  id uuid default gen_random_uuid() primary key,
  host_id uuid references profiles(id) not null,
  title text not null,
  description text not null,
  property_type text not null,
  location text not null,
  address text not null,
  price_per_night integer not null,
  min_nights integer default 1,
  max_guests integer not null,
  bedrooms integer not null,
  beds integer not null,
  bathrooms numeric not null,
  amenities text[] default '{}',
  images text[] default '{}',
  is_published boolean default false,
  slug text unique not null,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table listings enable row level security;

create policy "Anyone can view published listings" on listings
  for select using (is_published = true);

create policy "Hosts can view their own listings" on listings
  for select using (auth.uid() = host_id);

create policy "Hosts can insert their own listings" on listings
  for insert with check (auth.uid() = host_id);

create policy "Hosts can update their own listings" on listings
  for update using (auth.uid() = host_id);

create policy "Hosts can delete their own listings" on listings
  for delete using (auth.uid() = host_id);
```

#### bookings

```sql
create table bookings (
  id uuid default gen_random_uuid() primary key,
  guest_id uuid references profiles(id) not null,
  listing_id uuid references listings(id) not null,
  check_in_date date not null,
  check_out_date date not null,
  guest_count integer not null,
  nights integer not null,
  total_price integer not null,
  status text not null default 'pending',
  special_requests text,
  cancellation_reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone
);

-- Set up Row Level Security (RLS)
alter table bookings enable row level security;

create policy "Guests can view their own bookings" on bookings
  for select using (auth.uid() = guest_id);

create policy "Hosts can view bookings for their listings" on bookings
  for select using (
    auth.uid() in (
      select host_id from listings where id = listing_id
    )
  );

create policy "Guests can insert their own bookings" on bookings
  for insert with check (auth.uid() = guest_id);

create policy "Guests can update their own bookings" on bookings
  for update using (auth.uid() = guest_id);

create policy "Hosts can update bookings for their listings" on bookings
  for update using (
    auth.uid() in (
      select host_id from listings where id = listing_id
    )
  );
```

#### favorites

```sql
create table favorites (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references profiles(id) not null,
  listing_id uuid references listings(id) not null,
  created_at timestamp with time zone default now(),
  unique(user_id, listing_id)
);

-- Set up Row Level Security (RLS)
alter table favorites enable row level security;

create policy "Users can view their own favorites" on favorites
  for select using (auth.uid() = user_id);

create policy "Users can insert their own favorites" on favorites
  for insert with check (auth.uid() = user_id);

create policy "Users can delete their own favorites" on favorites
  for delete using (auth.uid() = user_id);
```

5. Create Storage Buckets

Create the following storage buckets in Supabase:

- `listing_images` - For property listing images
- `avatars` - For user profile avatars

Set up public access policies for these buckets as needed.

6. Run the development server

```bash
npm run dev
# or
yarn dev
```

7. Seed the database (optional)

To populate your database with sample data:

```bash
node scripts/seed-data.js
```

This will create test users, listings, and bookings for development purposes.

## Project Structure

```
natuurhuisje/
├── app/                      # App Router pages
│   ├── account/              # User account pages
│   ├── actions/              # Server actions
│   ├── api/                  # API routes
│   ├── auth/                 # Auth routes
│   ├── host/                 # Host dashboard pages
│   ├── search/               # Search page
│   └── stay/                 # Listing detail pages
├── components/               # UI components
│   ├── account/              # Account related components
│   ├── auth/                 # Auth related components
│   ├── host/                 # Host dashboard components
│   ├── layout/              # Layout components
│   └── ui/                   # Reusable UI components
├── lib/                      # Utility functions
├── public/                   # Static assets
├── scripts/                  # Utility scripts
├── utils/                    # Utility functions
│   └── supabase/             # Supabase client utilities
└── ...
```

## User Flow

1. **Authentication**
   - Users can sign up, log in, and log out
   - OAuth providers support (Google, etc.)

2. **Browse Listings**
   - Home page with featured listings
   - Search page with filters
   - Listing detail page with gallery and booking form

3. **Booking Process**
   - Select dates and number of guests
   - Submit booking request
   - Host confirms or rejects booking
   - Guest receives confirmation

4. **User Dashboard**
   - View and manage bookings
   - View favorite listings

5. **Host Dashboard**
   - View and manage listings
   - View and manage booking requests
   - View booking calendar

## Deployment

The application can be deployed to Vercel, Netlify, or any other platform that supports Next.js applications.

1. Connect your repository to your preferred hosting platform
2. Set up the environment variables
3. Deploy the application

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Lucide Icons](https://lucide.dev/)

---

Built with ❤️ by [Your Name]
