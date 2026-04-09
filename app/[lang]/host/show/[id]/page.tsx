"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { createClient } from "@/utils/supabase/client";
import { ArrowLeft, MapPin, BedDouble, Users, Bath } from "lucide-react";

type HouseDetails = {
  id: number;
  accommodation_name: string | null;
  description: string | null;
  location: string | null;
  type: string | null;
  status: string | null;
  bedrooms?: number | null;
  bathrooms?: number | null;
  max_guests?: number | null;
  max_person?: number | null;
  price_per_night: number | null;
  created_at: string;
  house_images?: { id?: number; image_url: string; sort_order: number; is_primary?: boolean }[];
  images?: string[];
  special_pricing?: {
    id: number;
    start_date: string;
    end_date: string;
    price_per_night: number;
    occasion_name?: string | null;
    status?: string | null;
  }[];
  [key: string]: unknown;
};

export default function HostShowListingPage() {
  const params = useParams();
  const lang = (params?.lang as string) || "en";
  const id = params?.id as string;
  const supabase = useMemo(() => createClient(), []);

  const [listing, setListing] = useState<HouseDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        setLoading(true);
        setError(null);

        const numericId = Number(id);
        const listingId = Number.isNaN(numericId) ? id : numericId;

        const { data, error: fetchError } = await supabase
          .from("houses")
          .select(
            `
            *,
            house_images (
              id,
              image_url,
              sort_order,
              is_primary
            ),
            special_pricing (
              id,
              start_date,
              end_date,
              price_per_night,
              occasion_name,
              status
            )
          `,
          )
          .eq("id", listingId)
          .single();

        if (fetchError) {
          setError(fetchError.message);
          return;
        }

        const row = data as any;
        setListing({
          ...row,
          max_guests: row.max_guests ?? row.max_person ?? null,
        } as HouseDetails);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load listing details");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      void fetchListing();
    }
  }, [id, supabase]);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-purple-600" />
      </div>
    );
  }

  if (error || !listing) {
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-rose-700">
        {error || "Listing not found"}
      </div>
    );
  }

  const sortedImages = [...(listing.house_images || [])].sort((a, b) => a.sort_order - b.sort_order);
  const relatedImages = sortedImages.map((image) => image.image_url).filter(Boolean);
  const legacyImages = (listing.images || []).filter(Boolean);
  const allImages = Array.from(new Set([...relatedImages, ...legacyImages]));
  const heroImage = allImages[0] || "";
  const visibleFields = Object.entries(listing).filter(([key]) => key !== "house_images");

  const formatValue = (value: unknown) => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    if (typeof value === "string" || typeof value === "number") return String(value);
    if (Array.isArray(value)) {
      if (value.length === 0) return "[]";
      return JSON.stringify(value, null, 2);
    }
    return JSON.stringify(value, null, 2);
  };

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/${lang}/admin/listings`}
          className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Listings
        </Link>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-50">
            {heroImage ? (
              <Image
                src={heroImage}
                alt={listing.accommodation_name || "Listing image"}
                width={900}
                height={600}
                className="h-[320px] w-full object-cover"
              />
            ) : (
              <div className="flex h-[320px] items-center justify-center text-slate-400">No image</div>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{listing.accommodation_name || "Untitled Listing"}</h1>
              <p className="mt-2 text-sm text-slate-600">{listing.description || "No description"}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Type</p>
                <p className="font-medium capitalize">{listing.type || "-"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Status</p>
                <p className="font-medium capitalize">{listing.status || "-"}</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Price</p>
                <p className="font-medium">€{listing.price_per_night || 0}/night</p>
              </div>
              <div className="rounded-lg bg-slate-50 p-3">
                <p className="text-xs text-slate-500">Created</p>
                <p className="font-medium">{new Date(listing.created_at).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-slate-600">
              <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{listing.location || "No location"}</span>
              <span className="inline-flex items-center gap-1.5"><BedDouble className="h-4 w-4" />{listing.bedrooms || 0} bedrooms</span>
              <span className="inline-flex items-center gap-1.5"><Bath className="h-4 w-4" />{listing.bathrooms || 0} bathrooms</span>
              <span className="inline-flex items-center gap-1.5"><Users className="h-4 w-4" />{listing.max_guests || 0} guests</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">All Images</h2>
        {allImages.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {allImages.map((imageUrl, index) => (
              <div key={`${imageUrl}-${index}`} className="overflow-hidden rounded-lg border border-slate-200 bg-slate-50">
                <Image
                  src={imageUrl}
                  alt={`Listing image ${index + 1}`}
                  width={400}
                  height={300}
                  className="h-32 w-full object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-sm text-slate-500">
            No images available for this listing.
          </div>
        )}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">All Listing Fields</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {visibleFields.map(([key, value]) => (
            <div key={key} className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</p>
              {typeof value === "object" ? (
                <pre className="whitespace-pre-wrap break-all text-sm text-slate-700">{formatValue(value)}</pre>
              ) : (
                <p className="text-sm text-slate-700">{formatValue(value)}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
