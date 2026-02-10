"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";

// Schema for creating or updating a listing
const listingSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  description: z.string().min(20, "Description must be at least 20 characters"),
  property_type: z.enum(["cabin", "treehouse", "glamping", "tiny-house", "farm", "other"]),
  location: z.string().min(2, "Location is required"),
  address: z.string().min(5, "Full address is required"),
  price_per_night: z.number().positive("Price must be greater than 0"),
  min_nights: z.number().int().positive().default(1),
  max_guests: z.number().int().min(1, "Maximum guests must be at least 1"),
  bedrooms: z.number().int().min(0),
  beds: z.number().int().min(1, "At least one bed is required"),
  bathrooms: z.number().min(0),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  is_published: z.boolean().default(false),
});

type ListingData = z.infer<typeof listingSchema>;

// Helper function to create a unique slug for the listing
async function createUniqueSlug(title: string, supabase: any) {
  let slug = slugify(title, { lower: true, strict: true });
  const { data } = await supabase
    .from("listings")
    .select("slug")
    .eq("slug", slug)
    .single();
    
  // If slug already exists, append a random string
  if (data) {
    const randomStr = Math.random().toString(36).substring(2, 6);
    slug = `${slug}-${randomStr}`;
  }
  
  return slug;
}

// Action to create a new listing
export async function createListing(formData: FormData) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to create a listing" };
  }
  
  // Parse and validate form data
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      property_type: formData.get("property_type") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      price_per_night: Number(formData.get("price_per_night")),
      min_nights: Number(formData.get("min_nights") || 1),
      max_guests: Number(formData.get("max_guests")),
      bedrooms: Number(formData.get("bedrooms")),
      beds: Number(formData.get("beds")),
      bathrooms: Number(formData.get("bathrooms")),
      amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
      images: JSON.parse((formData.get("images") as string) || "[]"),
      is_published: formData.get("is_published") === "true",
    };
    
    const validatedData = listingSchema.parse(rawData);
    
    // Create a unique slug for the listing
    const slug = await createUniqueSlug(validatedData.title, supabase);
    
    // Update host status if not already a host
    const { data: profile } = await supabase
      .from("profiles")
      .select("is_host")
      .eq("id", session.user.id)
      .single();
      
    if (profile && !profile.is_host) {
      await supabase
        .from("profiles")
        .update({ is_host: true })
        .eq("id", session.user.id);
    }
    
    // Create listing
    const { data: listing, error } = await supabase
      .from("listings")
      .insert({
        ...validatedData,
        host_id: session.user.id,
        slug,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
      
    if (error) {
      return { error: error.message };
    }
    
    // Revalidate paths
    revalidatePath("/host/listings");
    
    // Redirect to the listings page
    redirect("/host/listings");
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please check your input: " + error.errors.map(e => e.message).join(", ") };
    }
    
    return { error: "Failed to create listing. Please try again." };
  }
}

// Action to update an existing listing
export async function updateListing(listingId: string, formData: FormData) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to update a listing" };
  }
  
  // Check if user is the owner of the listing
  const { data: existingListing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("host_id", session.user.id)
    .single();
    
  if (!existingListing) {
    return { error: "You are not authorized to update this listing" };
  }
  
  // Parse and validate form data
  try {
    const rawData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      property_type: formData.get("property_type") as string,
      location: formData.get("location") as string,
      address: formData.get("address") as string,
      price_per_night: Number(formData.get("price_per_night")),
      min_nights: Number(formData.get("min_nights") || 1),
      max_guests: Number(formData.get("max_guests")),
      bedrooms: Number(formData.get("bedrooms")),
      beds: Number(formData.get("beds")),
      bathrooms: Number(formData.get("bathrooms")),
      amenities: JSON.parse((formData.get("amenities") as string) || "[]"),
      images: JSON.parse((formData.get("images") as string) || "[]"),
      is_published: formData.get("is_published") === "true",
    };
    
    const validatedData = listingSchema.parse(rawData);
    
    // Check if title has changed; if so, update the slug
    let updateData: any = { ...validatedData };
    if (validatedData.title !== existingListing.title) {
      updateData.slug = await createUniqueSlug(validatedData.title, supabase);
    }
    
    // Update listing
    const { error } = await supabase
      .from("listings")
      .update({
        ...updateData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", listingId);
      
    if (error) {
      return { error: error.message };
    }
    
    // Revalidate paths
    revalidatePath("/host/listings");
    revalidatePath(`/host/listings/${listingId}/edit`);
    
    // Redirect back to the listings page
    redirect("/host/listings");
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please check your input: " + error.errors.map(e => e.message).join(", ") };
    }
    
    return { error: "Failed to update listing. Please try again." };
  }
}

// Action to delete a listing
export async function deleteListing(listingId: string) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to delete a listing" };
  }
  
  // Check if user is the owner of the listing
  const { data: existingListing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("host_id", session.user.id)
    .single();
    
  if (!existingListing) {
    return { error: "You are not authorized to delete this listing" };
  }
  
  // Check if there are any active bookings for this listing
  const { data: activeBookings } = await supabase
    .from("bookings")
    .select("id")
    .eq("listing_id", listingId)
    .in("status", ["confirmed", "pending"])
    .limit(1);
    
  if (activeBookings && activeBookings.length > 0) {
    return { error: "Cannot delete listing with active bookings" };
  }
  
  // Delete the listing
  const { error } = await supabase
    .from("listings")
    .delete()
    .eq("id", listingId);
    
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate paths
  revalidatePath("/host/listings");
  
  return { success: true };
}

// Action to toggle listing publish status
export async function toggleListingPublishStatus(listingId: string) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to update a listing" };
  }
  
  // Check if user is the owner of the listing
  const { data: existingListing } = await supabase
    .from("listings")
    .select("*")
    .eq("id", listingId)
    .eq("host_id", session.user.id)
    .single();
    
  if (!existingListing) {
    return { error: "You are not authorized to update this listing" };
  }
  
  // Toggle the is_published status
  const { error } = await supabase
    .from("listings")
    .update({
      is_published: !existingListing.is_published,
      updated_at: new Date().toISOString(),
    })
    .eq("id", listingId);
    
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate paths
  revalidatePath("/host/listings");
  
  return { 
    success: true,
    is_published: !existingListing.is_published 
  };
}
