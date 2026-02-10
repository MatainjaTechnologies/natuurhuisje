import { redirect } from 'next/navigation';
import { createClient } from '@/utils/supabase/server';
import { ListingForm } from '@/components/host/ListingForm';

export default async function EditListingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: listingId } = await params;
  const supabase = await createClient();
  
  // Check if user is logged in
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    redirect('/login');
  }
  
  // Fetch listing
  const { data: listing, error } = await supabase
    .from('listings')
    .select('*')
    .eq('id', listingId)
    .single();
    
  // Check if listing exists and belongs to the current user
  if (error || !listing || listing.host_id !== session.user.id) {
    redirect('/host/listings');
  }

  return (
    <div className="bg-cream-50 min-h-screen">
      <div className="bg-forest-900 text-white py-6">
        <div className="container-custom">
          <h1 className="text-2xl font-semibold mb-2">Edit Listing</h1>
          <p className="text-cream-100">{listing.title}</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        <ListingForm listing={listing} isNew={false} />
      </div>
    </div>
  );
}
