import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import { AuthForm } from '@/components/auth/AuthForm';

export default async function LoginPage() {
  const supabase = await createClient();
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (session) {
    redirect('/');
  }
  
  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="mt-6 text-3xl font-bold tracking-tight text-forest-900">
            Welcome back
          </h1>
          <p className="mt-2 text-sm text-forest-600">
            Sign in to your account to continue
          </p>
        </div>
        
        <AuthForm type="login" />
        
        <div className="text-center mt-4">
          <p className="text-sm text-forest-600">
            Don't have an account?{' '}
            <Link href="/register" className="font-medium text-forest-800 hover:text-forest-900">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
