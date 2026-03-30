import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const maxResults = parseInt(searchParams.get('limit') || '20');

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ error: 'Search query is required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Try semantic search first, fallback to regular search if function doesn't exist
    let data, error;
    
    try {
      const result = await (supabase as any).rpc('search_houses', {
        search_query: query,
        max_results: maxResults
      });
      data = result.data;
      error = result.error;
    } catch (rpcError) {
      console.warn('Semantic search function not available, using fallback:', rpcError);
      // Fallback to regular text search
      const result = await supabase
        .from('houses')
        .select('*')
        .eq('is_published', true)
        .or(`accommodation_name.ilike.%${query}%,description.ilike.%${query}%,location.ilike.%${query}%`)
        .limit(maxResults);
      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error('Search error:', error);
      return NextResponse.json({ error: 'Search failed' }, { status: 500 });
    }

    // Fetch images for each result
    const houseIds = data?.map((house: any) => house.id) || [];
    
    if (houseIds.length > 0) {
      const { data: imagesData } = await supabase
        .from('house_images')
        .select('house_id, image_url, sort_order')
        .in('house_id', houseIds)
        .order('sort_order', { ascending: true });

      // Group images by house_id
      const imagesByHouse: { [key: number]: string[] } = {};
      imagesData?.forEach((img: any) => {
        if (!imagesByHouse[img.house_id]) {
          imagesByHouse[img.house_id] = [];
        }
        imagesByHouse[img.house_id].push(img.image_url);
      });

      // Attach images to results and ensure proper structure
      const resultsWithImages = data.map((house: any) => ({
        id: house.id,
        accommodation_name: house.accommodation_name,
        description: house.description,
        location: house.location,
        place: house.place,
        type: house.type,
        price_per_night: house.price_per_night,
        max_person: house.max_person,
        bedrooms: house.bedrooms,
        bathrooms: house.bathrooms,
        rank: house.rank,
        images: imagesByHouse[house.id] || []
      }));

      return NextResponse.json({
        success: true,
        results: resultsWithImages,
        count: resultsWithImages.length
      });
    }

    return NextResponse.json({
      success: true,
      results: data || [],
      count: data?.length || 0
    });

  } catch (error) {
    console.error('Search API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
