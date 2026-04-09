-- Create admin_users table (same structure as users, but for admin accounts)
CREATE TABLE IF NOT EXISTS public.admin_users (
  id uuid NOT NULL DEFAULT gen_random_uuid(),
  auth_user_id uuid NOT NULL,
  role public.user_role NOT NULL DEFAULT 'admin'::user_role,
  status public.user_status NOT NULL DEFAULT 'pending_verification'::user_status,
  is_verified boolean NOT NULL DEFAULT false,
  verification_document_url text NULL,
  first_name text NULL,
  last_name text NULL,
  display_name text NULL,
  avatar_url text NULL,
  date_of_birth date NULL,
  gender public.user_gender NULL,
  email text NOT NULL,
  alternative_email text NULL,
  website text NULL,
  phone_country_code text NULL,
  phone_number text NULL,
  phone_full text GENERATED ALWAYS AS ((phone_country_code || phone_number)) STORED NULL,
  phone_verified boolean NOT NULL DEFAULT false,
  phone_verification_code text NULL,
  address_line_1 text NULL,
  address_line_2 text NULL,
  city text NULL,
  state text NULL,
  postal_code text NULL,
  country text NOT NULL DEFAULT 'NL'::text,
  coordinates point NULL,
  nationality text NULL,
  currency_preference text NOT NULL DEFAULT 'EUR'::text,
  timezone text NOT NULL DEFAULT 'UTC'::text,
  preferred_language text NOT NULL DEFAULT 'en'::text,
  email_notifications boolean NOT NULL DEFAULT true,
  sms_notifications boolean NOT NULL DEFAULT false,
  marketing_emails boolean NOT NULL DEFAULT false,
  stripe_customer_id text NULL,
  payment_methods jsonb NULL,
  company_name text NULL,
  tax_id text NULL,
  business_license text NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  last_login_at timestamp with time zone NULL,
  preferences jsonb NULL,
  metadata jsonb NULL,
  role_id integer NULL DEFAULT 1,
  CONSTRAINT admin_users_pkey PRIMARY KEY (id),
  CONSTRAINT admin_users_role_only_admin CHECK (role = 'admin'::user_role),
  CONSTRAINT admin_users_alternative_email_key UNIQUE (alternative_email),
  CONSTRAINT admin_users_auth_user_id_key UNIQUE (auth_user_id),
  CONSTRAINT admin_users_email_key UNIQUE (email),
  CONSTRAINT admin_users_auth_user_id_fkey FOREIGN KEY (auth_user_id) REFERENCES auth.users (id) ON DELETE CASCADE,
  CONSTRAINT admin_users_role_id_fkey FOREIGN KEY (role_id) REFERENCES roles (id)
) TABLESPACE pg_default;

CREATE INDEX IF NOT EXISTS idx_admin_users_email ON public.admin_users USING btree (email) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_coordinates ON public.admin_users USING gist (coordinates) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_auth_user_id ON public.admin_users USING btree (auth_user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_role ON public.admin_users USING btree (role) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_status ON public.admin_users USING btree (status) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_country ON public.admin_users USING btree (country) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_phone_full ON public.admin_users USING btree (phone_full) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_admin_users_role_id ON public.admin_users USING btree (role_id) TABLESPACE pg_default;

DROP TRIGGER IF EXISTS update_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER update_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can read admin_users" ON public.admin_users;
CREATE POLICY "Admins can read admin_users" ON public.admin_users
FOR SELECT
USING (auth.uid() = auth_user_id);
