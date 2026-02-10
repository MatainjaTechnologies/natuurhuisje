"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";

// Schema for creating a booking
const createBookingSchema = z.object({
  listing_id: z.string().uuid(),
  check_in_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/), // YYYY-MM-DD format
  check_out_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  guest_count: z.number().int().min(1),
  nights: z.number().int().min(1),
  total_price: z.number().positive(),
  special_requests: z.string().optional(),
});

type CreateBookingData = z.infer<typeof createBookingSchema>;

// Action to create a new booking
export async function createBooking(formData: FormData) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to make a booking" };
  }
  
  // Parse and validate form data
  try {
    const rawData = {
      listing_id: formData.get("listing_id") as string,
      check_in_date: formData.get("check_in_date") as string,
      check_out_date: formData.get("check_out_date") as string,
      guest_count: Number(formData.get("guest_count")),
      nights: Number(formData.get("nights")),
      total_price: Number(formData.get("total_price")),
      special_requests: (formData.get("special_requests") as string) || "",
    };
    
    const validatedData = createBookingSchema.parse(rawData);
    
    // Create booking
    const { data: booking, error } = await supabase
      .from("bookings")
      .insert({
        ...validatedData,
        guest_id: session.user.id,
        status: "pending", // Initial status is pending
        created_at: new Date().toISOString(),
      } as any)
      .select()
      .single();
      
    if (error) {
      return { error: error.message };
    }
    
    // Revalidate relevant paths
    revalidatePath("/account");
    
    // Redirect to booking confirmation page
    redirect(`/account?tab=bookings&success=true`);
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please check your input: " + error.errors.map(e => e.message).join(", ") };
    }
    
    return { error: "Failed to create booking. Please try again." };
  }
}

// Action to update booking status
export async function updateBookingStatus(bookingId: string, status: 'confirmed' | 'cancelled' | 'completed') {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to update a booking" };
  }
  
  // Check if user is the host of the listing associated with this booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*, listings!inner(*)")
    .eq("id", bookingId)
    .single() as { data: any };
    
  if (!booking || booking.listings.host_id !== session.user.id) {
    return { error: "You are not authorized to update this booking" };
  }
  
  // Update booking status
  const { error } = await (supabase
    .from("bookings") as any)
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", bookingId);
    
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate relevant paths
  revalidatePath("/host/bookings");
  
  return { success: true };
}

// Action to cancel a booking as a guest
export async function cancelBooking(bookingId: string) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to cancel a booking" };
  }
  
  // Check if user is the guest who made this booking
  const { data: booking } = await supabase
    .from("bookings")
    .select("*")
    .eq("id", bookingId)
    .eq("guest_id", session.user.id)
    .single() as { data: any };
    
  if (!booking) {
    return { error: "You are not authorized to cancel this booking" };
  }
  
  // Check if the booking is in a state that can be cancelled
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    return { error: "This booking cannot be cancelled" };
  }
  
  // Calculate if we're within the cancellation policy time window
  const checkInDate = new Date(booking.check_in_date);
  const today = new Date();
  const daysDifference = Math.ceil((checkInDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  // Cancel the booking
  const { error } = await (supabase
    .from("bookings") as any)
    .update({ 
      status: "cancelled",
      cancellation_reason: "Guest cancelled",
      updated_at: new Date().toISOString()
    })
    .eq("id", bookingId);
    
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate relevant paths
  revalidatePath("/account");
  
  return { success: true };
}
