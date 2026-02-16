import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { email, password, firstName, surname, phoneNumber, countryCode, role } = await request.json();

    const supabase = await createClient();

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: surname,
          role: role
        }
      }
    });

    if (authError?.message.includes('rate limit')) {
      return NextResponse.json({ 
        error: 'Rate limit reached. This is a Supabase limitation. Please wait 1 hour or try a different email/IP.' 
      }, { status: 429 });
    }

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 400 });
    }

    // Create user profile in database with correct role
    if (authData.user) {
      const userData = {
        auth_user_id: authData.user.id,
        email,
        first_name: firstName,
        last_name: surname,
        phone_country_code: countryCode,
        phone_number: phoneNumber,
        role: role, // This should be 'landlord'
        status: 'pending_verification',
        is_verified: false,
        display_name: `${firstName} ${surname}`
      };

      const { error: profileError } = await supabase
        .from('users')
        .insert(userData as any);

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Don't fail the registration, just log the error
        // The auth user was created successfully
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Registration successful! Please check your email for verification.',
        user: authData.user,
        profileCreated: !profileError
      });
    }

    return NextResponse.json({ error: 'Failed to create user' }, { status: 400 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'An unknown error occurred' 
    }, { status: 500 });
  }
}
