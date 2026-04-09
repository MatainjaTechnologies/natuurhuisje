import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createAdminClient } from '@/utils/supabase/admin';

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const adminClient = createAdminClient();

    const { data: existingAdmin, error: existingAdminError } = await (adminClient as any)
      .from('admin_users')
      .select('id, role')
      .eq('auth_user_id', user.id)
      .maybeSingle();

    if (existingAdminError) {
      throw existingAdminError;
    }

    if (!existingAdmin || existingAdmin.role !== 'admin') {
      return NextResponse.json(
        { success: false, error: 'Admin user not found in admin_users table' },
        { status: 403 },
      );
    }

    const firstName = user.user_metadata?.first_name || null;
    const lastName = user.user_metadata?.last_name || null;
    const displayName = `${firstName || ''} ${lastName || ''}`.trim() || user.email || null;

    const { data, error } = await (adminClient as any)
      .from('admin_users')
      .update({
        email: user.email,
        first_name: firstName,
        last_name: lastName,
        display_name: displayName,
        avatar_url: user.user_metadata?.avatar_url || null,
        is_verified: Boolean(user.email_confirmed_at),
        status: user.email_confirmed_at ? 'active' : 'pending_verification',
        last_login_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('auth_user_id', user.id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error('Error in POST /api/admin/sync-user:', error);
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to sync admin user' },
      { status: 500 },
    );
  }
}
