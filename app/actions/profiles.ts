"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

// Schema for updating a user profile
const profileSchema = z.object({
  first_name: z.string().min(1, "First name is required"),
  last_name: z.string().min(1, "Last name is required"),
  phone_number: z.string().optional(),
  bio: z.string().optional(),
  avatar_url: z.string().optional(),
});

type ProfileData = z.infer<typeof profileSchema>;

// Action to update user profile
export async function updateProfile(formData: FormData) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to update your profile" };
  }
  
  // Parse and validate form data
  try {
    const rawData = {
      first_name: formData.get("first_name") as string,
      last_name: formData.get("last_name") as string,
      phone_number: formData.get("phone_number") as string || undefined,
      bio: formData.get("bio") as string || undefined,
      avatar_url: formData.get("avatar_url") as string || undefined,
    };
    
    const validatedData = profileSchema.parse(rawData);
    
    // Update profile
    const { error } = await supabase
      .from("profiles")
      .update({
        ...validatedData,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);
      
    if (error) {
      return { error: error.message };
    }
    
    // Revalidate paths
    revalidatePath("/account");
    
    return { success: true };
    
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { error: "Please check your input: " + error.errors.map(e => e.message).join(", ") };
    }
    
    return { error: "Failed to update profile. Please try again." };
  }
}

// Action to upload profile avatar
export async function uploadAvatar(formData: FormData) {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to upload an avatar" };
  }
  
  const avatarFile = formData.get("avatar") as File;
  
  if (!avatarFile) {
    return { error: "No avatar file provided" };
  }
  
  try {
    // Upload the avatar to Supabase Storage
    const fileExt = avatarFile.name.split('.').pop();
    const filePath = `${session.user.id}/avatar.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(filePath, avatarFile, {
        upsert: true,
      });
      
    if (uploadError) {
      return { error: uploadError.message };
    }
    
    // Get the public URL of the uploaded avatar
    const { data: { publicUrl } } = supabase.storage
      .from("avatars")
      .getPublicUrl(filePath);
      
    // Update the user's profile with the new avatar URL
    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq("id", session.user.id);
      
    if (updateError) {
      return { error: updateError.message };
    }
    
    // Revalidate paths
    revalidatePath("/account");
    
    return {
      success: true,
      avatarUrl: publicUrl
    };
    
  } catch (error) {
    return { error: "Failed to upload avatar. Please try again." };
  }
}

// Action to toggle user's host status
export async function toggleHostStatus() {
  // Get session to check if user is logged in
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return { error: "You must be logged in to change your host status" };
  }
  
  // Get current profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("is_host")
    .eq("id", session.user.id)
    .single();
    
  if (!profile) {
    return { error: "Profile not found" };
  }
  
  // Toggle host status
  const { error } = await supabase
    .from("profiles")
    .update({
      is_host: !profile.is_host,
      updated_at: new Date().toISOString(),
    })
    .eq("id", session.user.id);
    
  if (error) {
    return { error: error.message };
  }
  
  // Revalidate paths
  revalidatePath("/account");
  
  return {
    success: true,
    is_host: !profile.is_host
  };
}
