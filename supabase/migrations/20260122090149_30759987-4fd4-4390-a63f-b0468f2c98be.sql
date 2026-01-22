-- Fix 1: Teams table - Restrict write access to admin only
DROP POLICY IF EXISTS "Anyone can insert teams" ON public.teams;
DROP POLICY IF EXISTS "Anyone can update teams" ON public.teams;
DROP POLICY IF EXISTS "Anyone can delete teams" ON public.teams;

CREATE POLICY "Admins can insert teams"
ON public.teams
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update teams"
ON public.teams
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete teams"
ON public.teams
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Fix 2: Storage bucket - Restrict read access to admin only
DROP POLICY IF EXISTS "Allow public read access to data-exports" ON storage.objects;
DROP POLICY IF EXISTS "Allow public list access to data-exports" ON storage.objects;

CREATE POLICY "Admins can read exports"
ON storage.objects
FOR SELECT
TO authenticated
USING (
  bucket_id = 'data-exports' AND 
  public.has_role(auth.uid(), 'admin')
);

-- Fix 3: User roles table - Restrict SELECT to own role or admin
DROP POLICY IF EXISTS "Authenticated users can view roles" ON public.user_roles;

CREATE POLICY "Users can view own role or admins can view all"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));