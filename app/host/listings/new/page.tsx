import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ListingForm } from '@/components/host/ListingForm';

export default async function NewListingPage() {
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Get user profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  // Ensure user is a host
  if (profile && !profile.is_host) {
    await supabase
      .from('profiles')
      .update({ is_host: true })
      .eq('id', session.user.id);
  }

  // Create empty listing object for new listings
  const emptyListing = {
    id: '',
    host_id: session.user.id,
    title: '',
    description: '',
    property_type: 'cabin',
    location: '',
    address: '',
    price_per_night: 100,
    min_nights: 1,
    max_guests: 2,
    bedrooms: 1,
    beds: 1,
    bathrooms: 1,
    amenities: [],
    images: [],
    is_published: false
  };

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-forest-900 text-white py-6">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-2">Add New Listing</h1>
          <p className="text-cream-100">Create your new nature stay</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <ListingForm listing={emptyListing} isNew={true} />
      </div>
    </div>
  );
}
