-- Create enum for roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL DEFAULT 'user',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- RLS policies for user_roles table
-- Anyone authenticated can view roles
CREATE POLICY "Authenticated users can view roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (true);

-- Only admins can insert roles
CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Only admins can update roles
CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Only admins can delete roles
CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update matches table policies
DROP POLICY IF EXISTS "Anyone can insert matches" ON public.matches;
DROP POLICY IF EXISTS "Anyone can update matches" ON public.matches;
DROP POLICY IF EXISTS "Anyone can delete matches" ON public.matches;

CREATE POLICY "Admins can insert matches"
ON public.matches
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update matches"
ON public.matches
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete matches"
ON public.matches
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update players table policies
DROP POLICY IF EXISTS "Anyone can insert players" ON public.players;
DROP POLICY IF EXISTS "Anyone can update players" ON public.players;
DROP POLICY IF EXISTS "Anyone can delete players" ON public.players;

CREATE POLICY "Admins can insert players"
ON public.players
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update players"
ON public.players
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete players"
ON public.players
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update goals table policies
DROP POLICY IF EXISTS "Anyone can insert goals" ON public.goals;
DROP POLICY IF EXISTS "Anyone can update goals" ON public.goals;
DROP POLICY IF EXISTS "Anyone can delete goals" ON public.goals;

CREATE POLICY "Admins can insert goals"
ON public.goals
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update goals"
ON public.goals
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete goals"
ON public.goals
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update match_players table policies
DROP POLICY IF EXISTS "Anyone can insert match_players" ON public.match_players;
DROP POLICY IF EXISTS "Anyone can update match_players" ON public.match_players;
DROP POLICY IF EXISTS "Anyone can delete match_players" ON public.match_players;

CREATE POLICY "Admins can insert match_players"
ON public.match_players
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update match_players"
ON public.match_players
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete match_players"
ON public.match_players
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));