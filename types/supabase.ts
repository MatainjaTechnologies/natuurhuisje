export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string
          last_name: string
          avatar_url: string | null
          bio: string | null
          email: string
          phone: string | null
          is_host: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name: string
          last_name: string
          avatar_url?: string | null
          bio?: string | null
          email: string
          phone?: string | null
          is_host?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string
          last_name?: string
          avatar_url?: string | null
          bio?: string | null
          email?: string
          phone?: string | null
          is_host?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      listings: {
        Row: {
          id: string
          host_id: string
          title: string
          slug: string
          description: string
          property_type: 'cabin' | 'treehouse' | 'glamping' | 'tiny-house' | 'farm' | 'other'
          location: string
          address: string
          lat: number | null
          lng: number | null
          price_per_night: number
          min_nights: number
          max_guests: number
          bedrooms: number
          beds: number
          bathrooms: number
          amenities: string[] | null
          images: string[]
          is_published: boolean
          avg_rating: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          host_id: string
          title: string
          slug?: string
          description: string
          property_type: 'cabin' | 'treehouse' | 'glamping' | 'tiny-house' | 'farm' | 'other'
          location: string
          address: string
          lat?: number | null
          lng?: number | null
          price_per_night: number
          min_nights?: number
          max_guests: number
          bedrooms: number
          beds: number
          bathrooms: number
          amenities?: string[] | null
          images: string[]
          is_published?: boolean
          avg_rating?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          host_id?: string
          title?: string
          slug?: string
          description?: string
          property_type?: 'cabin' | 'treehouse' | 'glamping' | 'tiny-house' | 'farm' | 'other'
          location?: string
          address?: string
          lat?: number | null
          lng?: number | null
          price_per_night?: number
          min_nights?: number
          max_guests?: number
          bedrooms?: number
          beds?: number
          bathrooms?: number
          amenities?: string[] | null
          images?: string[]
          is_published?: boolean
          avg_rating?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      bookings: {
        Row: {
          id: string
          listing_id: string
          guest_id: string
          check_in_date: string
          check_out_date: string
          guest_count: number
          total_price: number
          status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          listing_id: string
          guest_id: string
          check_in_date: string
          check_out_date: string
          guest_count: number
          total_price: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          listing_id?: string
          guest_id?: string
          check_in_date?: string
          check_out_date?: string
          guest_count?: number
          total_price?: number
          status?: 'pending' | 'confirmed' | 'cancelled' | 'completed'
          created_at?: string
          updated_at?: string
        }
      }
      favorites: {
        Row: {
          id: string
          user_id: string
          listing_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          listing_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          listing_id?: string
          created_at?: string
        }
      }
      reviews: {
        Row: {
          id: string
          booking_id: string
          reviewer_id: string
          listing_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          booking_id: string
          reviewer_id: string
          listing_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          booking_id?: string
          reviewer_id?: string
          listing_id?: string
          rating?: number
          comment?: string | null
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      property_type: 'cabin' | 'treehouse' | 'glamping' | 'tiny-house' | 'farm' | 'other'
      amenity: 'wifi' | 'pets' | 'fireplace' | 'pool' | 'hot-tub' | 'bbq' | 'lake' | 'mountain-view' | 'beachfront' | 'secluded' | 'forest'
      booking_status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
    }
  }
}
