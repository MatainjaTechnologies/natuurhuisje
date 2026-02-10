// Seed script for Natuurhuisje application
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin privileges
);

// Sample property types and amenities
const propertyTypes = ['cabin', 'treehouse', 'glamping', 'tiny-house', 'farm', 'other'];
const amenities = ['wifi', 'pets', 'fireplace', 'pool', 'hot-tub', 'bbq', 'lake', 'mountain-view', 'beachfront', 'secluded', 'forest'];
const locations = [
  'Lake District, England',
  'Scottish Highlands, Scotland',
  'Snowdonia, Wales',
  'Cornwall, England',
  'Yorkshire Dales, England',
  'Peak District, England',
  'Pembrokeshire, Wales',
  'Norfolk Broads, England',
  'New Forest, England',
  'Brecon Beacons, Wales'
];

// Sample image URLs using Supabase storage
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const storageUrl = `${supabaseUrl}/storage/v1/object/public/listing_images`;

// Generate URLs for Supabase storage instead of Unsplash
const cabinImages = [
  `${storageUrl}/cabin-1.jpg`,
  `${storageUrl}/cabin-2.jpg`,
  `${storageUrl}/cabin-3.jpg`,
  `${storageUrl}/cabin-4.jpg`,
  `${storageUrl}/cabin-5.jpg`
];

const treehouseImages = [
  `${storageUrl}/treehouse-1.jpg`,
  `${storageUrl}/treehouse-2.jpg`,
  `${storageUrl}/treehouse-3.jpg`,
  `${storageUrl}/treehouse-4.jpg`,
  `${storageUrl}/treehouse-5.jpg`
];

const glampingImages = [
  `${storageUrl}/glamping-1.jpg`,
  `${storageUrl}/glamping-2.jpg`,
  `${storageUrl}/glamping-3.jpg`,
  `${storageUrl}/glamping-4.jpg`,
  `${storageUrl}/glamping-5.jpg`
];

const farmImages = [
  `${storageUrl}/farm-1.jpg`,
  `${storageUrl}/farm-2.jpg`,
  `${storageUrl}/farm-3.jpg`,
  `${storageUrl}/farm-4.jpg`,
  `${storageUrl}/farm-5.jpg`
];

// Function to randomly select items from an array
function getRandomItems(array, min, max) {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

// Function to generate random number within range
function getRandomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Function to create a unique slug
function createSlug(title) {
  return slugify(title, { lower: true, strict: true }) + '-' + Math.random().toString(36).substring(2, 6);
}

// Function to get images based on property type
function getImagesForPropertyType(propertyType) {
  switch (propertyType) {
    case 'cabin':
      return getRandomItems(cabinImages, 3, 5);
    case 'treehouse':
      return getRandomItems(treehouseImages, 3, 5);
    case 'glamping':
      return getRandomItems(glampingImages, 3, 5);
    case 'farm':
      return getRandomItems(farmImages, 3, 5);
    default:
      return getRandomItems([...cabinImages, ...treehouseImages, ...glampingImages, ...farmImages], 3, 5);
  }
}

// Function to generate a listing title based on property type
function generateListingTitle(propertyType, location) {
  const locationName = location.split(',')[0].trim();
  
  const cabinAdjectives = ['Cozy', 'Rustic', 'Charming', 'Secluded', 'Woodland'];
  const treehouseAdjectives = ['Magical', 'Elevated', 'Enchanting', 'Unique', 'Canopy'];
  const glampingAdjectives = ['Luxury', 'Safari', 'Boutique', 'Serene', 'Designer'];
  const farmAdjectives = ['Pastoral', 'Working', 'Historic', 'Idyllic', 'Organic'];
  const tinyHouseAdjectives = ['Compact', 'Modern', 'Minimalist', 'Efficient', 'Cute'];
  
  let adjectives;
  let nouns;
  
  switch (propertyType) {
    case 'cabin':
      adjectives = cabinAdjectives;
      nouns = ['Cabin', 'Lodge', 'Cottage', 'Retreat', 'Hideaway'];
      break;
    case 'treehouse':
      adjectives = treehouseAdjectives;
      nouns = ['Treehouse', 'Tree Lodge', 'Canopy Home', 'Tree Retreat', 'Elevated Cabin'];
      break;
    case 'glamping':
      adjectives = glampingAdjectives;
      nouns = ['Tent', 'Yurt', 'Bell Tent', 'Safari Tent', 'Glamping Pod'];
      break;
    case 'tiny-house':
      adjectives = tinyHouseAdjectives;
      nouns = ['Tiny House', 'Mini Cottage', 'Micro Home', 'Small Space', 'Compact Cabin'];
      break;
    case 'farm':
      adjectives = farmAdjectives;
      nouns = ['Farmhouse', 'Barn', 'Farm Cottage', 'Ranch Stay', 'Farmstead'];
      break;
    default:
      adjectives = [...cabinAdjectives, ...treehouseAdjectives, ...glampingAdjectives];
      nouns = ['Retreat', 'Hideaway', 'Getaway', 'Lodge', 'Stay'];
  }
  
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  
  return `${adjective} ${noun} in ${locationName}`;
}

// Function to generate a description based on property type and location
function generateDescription(propertyType, location, amenities) {
  const locationName = location.split(',')[0].trim();
  const regionName = location.split(',')[1].trim();
  
  let baseDescription = '';
  
  switch (propertyType) {
    case 'cabin':
      baseDescription = `Experience the tranquility of nature in this beautiful cabin nestled in the heart of ${locationName}, ${regionName}. Surrounded by stunning landscapes and fresh air, this is the perfect retreat from busy city life.`;
      break;
    case 'treehouse':
      baseDescription = `Live among the trees in this unique treehouse retreat in ${locationName}, ${regionName}. Elevated above the ground, you'll enjoy bird's-eye views of the surrounding nature and a truly magical experience.`;
      break;
    case 'glamping':
      baseDescription = `Enjoy the best of both worlds with this luxury glamping experience in ${locationName}, ${regionName}. All the beauty of camping with the comfort of premium amenities and stylish accommodations.`;
      break;
    case 'tiny-house':
      baseDescription = `Simplify and reconnect in this charming tiny house in ${locationName}, ${regionName}. Despite its compact size, it offers everything you need for a comfortable stay in a beautiful natural setting.`;
      break;
    case 'farm':
      baseDescription = `Experience authentic rural living at this working farm in ${locationName}, ${regionName}. Wake up to the sounds of nature and enjoy the peaceful countryside atmosphere while learning about farm life.`;
      break;
    default:
      baseDescription = `Escape to this unique nature retreat in ${locationName}, ${regionName}. Surrounded by beautiful scenery, this property offers a perfect balance of comfort and connection with nature.`;
  }
  
  const amenityDescriptions = [];
  
  if (amenities.includes('wifi')) {
    amenityDescriptions.push('Stay connected with complimentary high-speed WiFi.');
  }
  
  if (amenities.includes('pets')) {
    amenityDescriptions.push('Your furry friends are welcome to join your adventure!');
  }
  
  if (amenities.includes('fireplace')) {
    amenityDescriptions.push('Cozy up by the fireplace on chilly evenings.');
  }
  
  if (amenities.includes('pool')) {
    amenityDescriptions.push('Cool off in the private pool during warm summer days.');
  }
  
  if (amenities.includes('hot-tub')) {
    amenityDescriptions.push('Relax in the hot tub while stargazing after a day of exploring.');
  }
  
  const activitiesDescription = `The area offers numerous outdoor activities including hiking, cycling, and wildlife watching. ${locationName} is known for its natural beauty and is a perfect base for exploring ${regionName}.`;
  
  return `${baseDescription}\n\n${amenityDescriptions.join(' ')}\n\n${activitiesDescription}\n\nThis property provides a unique opportunity to disconnect from the hustle and bustle and reconnect with nature. Book your stay now for an unforgettable experience!`;
}

// Main seed function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...');

  try {
    // 1. Create test users
    console.log('Creating test users...');
    
    // Create a host user
    const hostEmail = 'host@example.com';
    const hostPassword = 'password123';
    
    const { data: hostData, error: hostError } = await supabase.auth.admin.createUser({
      email: hostEmail,
      password: hostPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: 'Host',
        last_name: 'User'
      }
    });
    
    if (hostError) {
      console.error('Error creating host user:', hostError);
      return;
    }
    
    const hostId = hostData.user.id;
    
    // Create a guest user
    const guestEmail = 'guest@example.com';
    const guestPassword = 'password123';
    
    const { data: guestData, error: guestError } = await supabase.auth.admin.createUser({
      email: guestEmail,
      password: guestPassword,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        first_name: 'Guest',
        last_name: 'User'
      }
    });
    
    if (guestError) {
      console.error('Error creating guest user:', guestError);
      return;
    }
    
    const guestId = guestData.user.id;
    
    // 2. Create profiles
    console.log('Creating user profiles...');
    
    await supabase.from('profiles').insert([
      {
        id: hostId,
        first_name: 'Host',
        last_name: 'User',
        is_host: true,
        created_at: new Date().toISOString()
      },
      {
        id: guestId,
        first_name: 'Guest',
        last_name: 'User',
        is_host: false,
        created_at: new Date().toISOString()
      }
    ]);
    
    // 3. Create listings
    console.log('Creating listings...');
    
    const listings = [];
    const listingCount = 15;
    
    for (let i = 0; i < listingCount; i++) {
      const propertyType = propertyTypes[Math.floor(Math.random() * propertyTypes.length)];
      const location = locations[Math.floor(Math.random() * locations.length)];
      const listingAmenities = getRandomItems(amenities, 3, 8);
      const title = generateListingTitle(propertyType, location);
      const description = generateDescription(propertyType, location, listingAmenities);
      const images = getImagesForPropertyType(propertyType);
      const price = getRandomNumber(50, 300);
      
      listings.push({
        id: uuidv4(),
        host_id: hostId,
        title,
        description,
        property_type: propertyType,
        location,
        address: `123 Nature Way, ${location}`,
        price_per_night: price,
        min_nights: getRandomNumber(1, 3),
        max_guests: getRandomNumber(2, 10),
        bedrooms: getRandomNumber(1, 4),
        beds: getRandomNumber(1, 6),
        bathrooms: getRandomNumber(1, 3),
        amenities: listingAmenities,
        images,
        is_published: Math.random() > 0.2, // 80% chance of being published
        slug: createSlug(title),
        created_at: new Date().toISOString()
      });
    }
    
    const { error: listingsError } = await supabase.from('listings').insert(listings);
    
    if (listingsError) {
      console.error('Error creating listings:', listingsError);
      return;
    }
    
    // 4. Create bookings
    console.log('Creating bookings...');
    
    const { data: insertedListings } = await supabase.from('listings').select('id, price_per_night');
    
    if (!insertedListings || insertedListings.length === 0) {
      console.error('No listings found for creating bookings');
      return;
    }
    
    const bookings = [];
    const currentDate = new Date();
    
    // Past bookings (completed)
    for (let i = 0; i < 5; i++) {
      const randomListing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const nights = getRandomNumber(2, 7);
      
      const checkOutDate = new Date();
      checkOutDate.setDate(currentDate.getDate() - getRandomNumber(1, 30));
      
      const checkInDate = new Date(checkOutDate);
      checkInDate.setDate(checkOutDate.getDate() - nights);
      
      bookings.push({
        id: uuidv4(),
        guest_id: guestId,
        listing_id: randomListing.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guest_count: getRandomNumber(1, 4),
        nights,
        total_price: randomListing.price_per_night * nights,
        status: 'completed',
        created_at: new Date(checkInDate.getTime() - 1000 * 60 * 60 * 24 * 14).toISOString()
      });
    }
    
    // Current bookings (confirmed)
    for (let i = 0; i < 3; i++) {
      const randomListing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const nights = getRandomNumber(2, 7);
      
      const checkInDate = new Date();
      checkInDate.setDate(currentDate.getDate() - getRandomNumber(0, 2));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + nights);
      
      bookings.push({
        id: uuidv4(),
        guest_id: guestId,
        listing_id: randomListing.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guest_count: getRandomNumber(1, 4),
        nights,
        total_price: randomListing.price_per_night * nights,
        status: 'confirmed',
        created_at: new Date(checkInDate.getTime() - 1000 * 60 * 60 * 24 * 7).toISOString()
      });
    }
    
    // Future bookings (confirmed)
    for (let i = 0; i < 4; i++) {
      const randomListing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const nights = getRandomNumber(2, 7);
      
      const checkInDate = new Date();
      checkInDate.setDate(currentDate.getDate() + getRandomNumber(3, 30));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + nights);
      
      bookings.push({
        id: uuidv4(),
        guest_id: guestId,
        listing_id: randomListing.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guest_count: getRandomNumber(1, 4),
        nights,
        total_price: randomListing.price_per_night * nights,
        status: 'confirmed',
        created_at: new Date().toISOString()
      });
    }
    
    // Pending bookings
    for (let i = 0; i < 2; i++) {
      const randomListing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const nights = getRandomNumber(2, 7);
      
      const checkInDate = new Date();
      checkInDate.setDate(currentDate.getDate() + getRandomNumber(10, 40));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + nights);
      
      bookings.push({
        id: uuidv4(),
        guest_id: guestId,
        listing_id: randomListing.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guest_count: getRandomNumber(1, 4),
        nights,
        total_price: randomListing.price_per_night * nights,
        status: 'pending',
        created_at: new Date().toISOString()
      });
    }
    
    // Cancelled bookings
    for (let i = 0; i < 1; i++) {
      const randomListing = insertedListings[Math.floor(Math.random() * insertedListings.length)];
      const nights = getRandomNumber(2, 7);
      
      const checkInDate = new Date();
      checkInDate.setDate(currentDate.getDate() + getRandomNumber(15, 50));
      
      const checkOutDate = new Date(checkInDate);
      checkOutDate.setDate(checkInDate.getDate() + nights);
      
      bookings.push({
        id: uuidv4(),
        guest_id: guestId,
        listing_id: randomListing.id,
        check_in_date: checkInDate.toISOString().split('T')[0],
        check_out_date: checkOutDate.toISOString().split('T')[0],
        guest_count: getRandomNumber(1, 4),
        nights,
        total_price: randomListing.price_per_night * nights,
        status: 'cancelled',
        cancellation_reason: 'Guest cancelled',
        created_at: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2).toISOString()
      });
    }
    
    const { error: bookingsError } = await supabase.from('bookings').insert(bookings);
    
    if (bookingsError) {
      console.error('Error creating bookings:', bookingsError);
      return;
    }
    
    // 5. Create favorites
    console.log('Creating favorites...');
    
    const favoritesCount = Math.min(5, insertedListings.length);
    const favorites = [];
    
    // Shuffle the listings array
    const shuffledListings = [...insertedListings].sort(() => 0.5 - Math.random());
    
    // Take the first n listings as favorites
    for (let i = 0; i < favoritesCount; i++) {
      favorites.push({
        id: uuidv4(),
        user_id: guestId,
        listing_id: shuffledListings[i].id,
        created_at: new Date().toISOString()
      });
    }
    
    const { error: favoritesError } = await supabase.from('favorites').insert(favorites);
    
    if (favoritesError) {
      console.error('Error creating favorites:', favoritesError);
      return;
    }
    
    console.log('✅ Database seeding completed successfully!');
    console.log('\nTest accounts created:');
    console.log(`Host: ${hostEmail} / ${hostPassword}`);
    console.log(`Guest: ${guestEmail} / ${guestPassword}`);
    
  } catch (error) {
    console.error('Unexpected error during seeding:', error);
  }
}

// Run the seed function
seedDatabase();
