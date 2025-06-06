
-- First, let's create a unique constraint on user_id for the user_memberships table
ALTER TABLE public.user_memberships 
ADD CONSTRAINT user_memberships_user_id_unique UNIQUE (user_id);

-- Now insert or update the test user membership
INSERT INTO public.user_memberships (user_id, status, expires_at, created_at, updated_at)
VALUES (
  (SELECT id FROM auth.users WHERE email = 'test@t.com' LIMIT 1),
  'active',
  (NOW() + INTERVAL '1 month'),
  NOW(),
  NOW()
)
ON CONFLICT (user_id) DO UPDATE SET
  status = 'active',
  expires_at = (NOW() + INTERVAL '1 month'),
  updated_at = NOW();
