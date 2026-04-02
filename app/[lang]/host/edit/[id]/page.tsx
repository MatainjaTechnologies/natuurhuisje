"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ListingWizard } from "@/components/host/ListingWizard";

interface Listing {
  id: string;
  host_id: string;
  title?: string;
  accommodation_name?: string;
  description: string;
  property_type?: string;
  type?: string;
  location: string;
  address?: string;
  street?: string;
  house_number?: string;
  postal_code?: string;
  place?: string;
  country?: string;
  region?: string;
  price_per_night: number;
  min_nights: number;
  max_guests?: number;
  max_person?: number;
  bedrooms: number;
  beds: number;
  bathrooms: number;
  amenities: string[];
  images?: string[];
  house_images?: {
    image_url: string;
    sort_order: number;
  }[];
  house_amenities?: {
    amenity_name: string;
  }[];
  house_rules?: {
    rule_type: string;
    rule_value: string | null;
  }[];
  extra_costs?: {
    cost_name: string;
    amount: number | null;
    required: boolean | null;
  }[];
  person_pricing?: {
    base_persons: number;
    additional_person_price: number | null;
  }[];
  sustainability_features?: {
    feature_key: string;
    feature_value: string | null;
  }[];
  rooms?: {
    id: number;
    name: string;
    description: string | null;
    room_type: string | null;
    size_m2: number | null;
    max_person: number;
    price_per_night: number | null;
  }[];
  arrival_departure_days?: {
    day_name: string;
    day_type: string;
  }[];
  plot_size?: string;
  is_near_neighbors?: boolean;
  registration_number_option?: string;
  registration_number?: string;
  has_public_transport?: boolean;
  energy_label?: string | null;
  is_published: boolean;
  created_at: string;
}

export default function EditListingPage() {
  const params = useParams();
  const supabase = createClient();
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const id = params.id as string;

  // Fetch listing data from Supabase
  useEffect(() => {
    const fetchListing = async () => {
      try {
        console.log("Fetching listing with id:", id);
        console.log("ID type:", typeof id, "ID value:", id);
        
        const { data, error } = await supabase
          .from("houses")
          .select(`
            *,
            house_images (
              image_url,
              sort_order
            ),
            house_amenities (
              amenity_name
            ),
            house_rules (
              rule_type,
              rule_value
            ),
            sustainability_features(
              feature_key,
              feature_value
            ),
            arrival_departure_days(
              day_name,
              day_type
            ),
            availability_settings(
              check_in_from,
              check_in_until,
              check_out_from,
              check_out_until,
              min_booking_days
            )
          `)
          .eq("id", id)
          .single();

        console.log("Supabase response:", { data, error });

        if (error) {
          console.error("Error details:", error);
          console.error("Error message:", error.message);
          console.error("Error details:", error.details);
          console.error("Error hint:", error.hint);
          setError(error.message || 'Unknown error occurred');
          return;
        }

        setListing(data);
      } catch (err) {
        console.error("Error fetching listing:", err);
        setError("Failed to load listing");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchListing();
    }
  }, [id, supabase]);

  // Transform database data to form format
  const transformListingData = (listing: Listing) => {
    return {
      id: id,
      accommodationName: listing.accommodation_name || listing.title || "",
      type: listing.type || listing.property_type || "Cottage",
      maxPerson: listing.max_person || listing.max_guests || 1,
      livingSituation: "Detached", // Default value since not in DB
      location: listing.location || "",
      plotSize: listing.plot_size || "", // Not in DB
      isNearNeighbors: listing.is_near_neighbors !== null ? listing.is_near_neighbors : null, // Use actual DB value
      registrationNumberOption: listing.registration_number_option || "I don't have a registration number", // Default
      registrationNumber: listing.registration_number || "", // Not in DB
      hasPublicTransport: listing.has_public_transport || false, // Use actual DB value

      // Location
      country: listing.country || "Netherlands", // Default
      region: listing.region || "Drenthe", // Default
      street: listing.street || "", // Not in DB
      number: listing.house_number || "", // Not in DB
      postalCode: listing.postal_code || "", // Not in DB
      place: listing.place || listing.address || "",
      landRegistrationOption: "", // Not in DB

      // Photos
      images: listing.house_images 
        ? listing.house_images
            .sort((a: any, b: any) => a.sort_order - b.sort_order)
            .map((img: any) => img.image_url)
        : [],

      // Pricing
      pricePerNight: listing.price_per_night?.toString() || "",
      includedFacilities: ['Final cleaning', 'Bed linen', 'Bath towels', 'Kitchen linen', 'Water', 'Electricity'], // Default values since column doesn't exist
      safetyDeposit: "no_deposit", // Default
      safetyDepositAmount: "", // Not in DB
      longerStayPricing: {
        weeklyPrice: "",
        monthlyPrice: "",
        weekendPrice: "",
        longWeekendPrice: "",
        weekdayPrice: "",
        weekPrice: "",
      }, // Not in DB
      personPricing: listing.person_pricing && listing.person_pricing.length > 0
        ? {
            basePersons: listing.person_pricing[0].base_persons || 0,
            additionalPersonPrice: listing.person_pricing[0].additional_person_price?.toString() || ""
          }
        : {
            basePersons: 0,
            additionalPersonPrice: "",
          }, // Use actual person pricing from database
      extraCosts: listing.extra_costs 
        ? listing.extra_costs.map((cost: any) => cost.cost_name)
        : [], // Use actual extra costs from database - only names as strings

      // Availability
      minNights: listing.min_nights || 1,
      maxNights: (listing as any).max_nights || 364,
      availabilityLimit: '2_years', // Default value since not stored in DB
      checkInFrom: (listing as any).availability_settings?.check_in_from || '15:00',
      checkInUntil: (listing as any).availability_settings?.check_in_until || '22:00',
      checkOutFrom: (listing as any).availability_settings?.check_out_from || '07:00',
      checkOutUntil: (listing as any).availability_settings?.check_out_until || '11:00',
      minBookingDays: (listing as any).availability_settings?.min_booking_days || 0,

      // Description
      description: listing.description || "",
      surroundings: "", // Not in DB

      // Stay Details
      amenities: listing.house_amenities 
        ? listing.house_amenities.map((amenity: any) => amenity.amenity_name)
        : (listing.amenities || []),

      // Sustainability
      energyLabel: listing.energy_label || "",
      sustainability: listing.sustainability_features && listing.sustainability_features.length > 0
        ? listing.sustainability_features.reduce((acc: any, feature: any) => {
            acc[feature.feature_key] = feature.feature_value || '';
            return acc;
          }, {} as Record<string, string>)
        : {}, // Use actual sustainability features from database

      // House Rules
      houseRules: listing.house_rules && listing.house_rules.length > 0
        ? listing.house_rules.reduce((acc: any, rule: any) => {
            // Map rule types to form field names
            switch (rule.rule_type) {
              case "babies_allowed":
                acc.babies = rule.rule_value;
                break;
              case 'pets_allowed':
                acc.pets = rule.rule_value;
                break;
              case 'child_age_limit':
                acc.childAge = parseInt(rule.rule_value) || 0;
                break;
              case 'min_booking_age':
                acc.bookingAge = parseInt(rule.rule_value) || 18;
                break;
              case 'parties_allowed':
                acc.parties = rule.rule_value === 'allowed' ? null : false;
                break;
              case 'smoking_allowed':
                acc.smoking = rule.rule_value === 'allowed' ? null : false;
                break;
              case 'fireworks_allowed':
                acc.fireworks = rule.rule_value === 'allowed' ? null : false;
                break;
              case 'groups_allowed':
                acc.groups = rule.rule_value === 'allowed' ? null : false;
                break;
              case 'waste_separation_required':
                acc.waste = rule.rule_value === 'separate' ? null : false;
                break;
              case 'silence_hours_start':
                acc.silenceStart = rule.rule_value;
                break;
              case 'silence_hours_end':
                acc.silenceEnd = rule.rule_value;
                break;
              case 'custom_rule':
                acc.customRules = [...acc.customRules, rule.rule_value];
                break;
              default:
                break;
            }
            return acc;
          }, {
            babies: 0,
            pets: 0,
            childAge: 0,
            bookingAge: 18,
            parties: null,
            smoking: null,
            fireworks: null,
            groups: null,
            waste: null,
            silenceStart: "",
            silenceEnd: "",
            customRules: [],
          })
        : {
            babies: 0,
            pets: 0,
            childAge: 0,
            bookingAge: 18,
            parties: null,
            smoking: null,
            fireworks: null,
            groups: null,
            waste: null,
            silenceStart: "",
            silenceEnd: "",
            customRules: [],
          }, // Use actual house rules from database

      // Bedrooms
      rooms: listing.rooms || [], // Use actual rooms from database

      // Calendar Availability
      arrivalDays: listing.arrival_departure_days 
        ? listing.arrival_departure_days
            .filter((day: any) => day.day_type === 'arrival')
            .map((day: any) => day.day_name)
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default if no data
      departureDays: listing.arrival_departure_days 
        ? listing.arrival_departure_days
            .filter((day: any) => day.day_type === 'departure')
            .map((day: any) => day.day_name)
        : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'], // Default if no data
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#59A559] mx-auto mb-4"></div>
          <p className="text-gray-600">Loading listing...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <button
            onClick={() => window.history.back()}
            className="bg-[#59A559] text-white px-6 py-2 rounded-lg hover:bg-[#4a8a4a] transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <ListingWizard
        mode="edit"
        existingListing={listing ? transformListingData(listing) : null}
      />
    </div>
  );
}
