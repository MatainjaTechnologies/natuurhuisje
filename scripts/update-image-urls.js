// Script to update image URLs in listings from Unsplash to Supabase storage
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Initialize Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY // Use service role key for admin privileges
);

const storageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/listing_images`;

async function updateImageUrls() {
  console.log('Starting image URL update...');

  // Fetch all listings
  const { data: allListings, error } = await supabase
    .from('listings')
    .select('id, title, property_type, images');
    
  if (error) {
    console.error('Error fetching listings:', error);
    return;
  }
  
  // Filter listings with Unsplash image URLs in JavaScript
  const listings = allListings.filter(listing => {
    return listing.images && 
           Array.isArray(listing.images) && 
           listing.images.some(url => url && url.includes('images.unsplash.com'));
  });
  
  console.log(`Found ${listings.length} listings with Unsplash images out of ${allListings.length} total listings`);
  
  // Process each listing
  for (const listing of listings) {
    console.log(`Processing listing: ${listing.title} (${listing.id})`);
    
    // Generate new image URLs based on property type
    const propertyType = listing.property_type || 'cabin';
    const imageType = propertyType === 'tiny-house' ? 'tinyhouse' : propertyType;
    
    // Create an array of new image URLs (up to 5 images)
    const newImages = Array.from({ length: Math.min(listing.images.length, 5) }, (_, i) => 
      `${storageUrl}/${imageType}-${i + 1}.jpg`
    );
    
    // Update the listing
    const { error: updateError } = await supabase
      .from('listings')
      .update({ images: newImages })
      .eq('id', listing.id);
      
    if (updateError) {
      console.error(`Error updating listing ${listing.id}:`, updateError);
    } else {
      console.log(`✅ Updated listing ${listing.id} with ${newImages.length} new image URLs`);
    }
  }
  
  console.log('\nImage URL update completed!');
}

// Run the function
updateImageUrls().catch(console.error);
