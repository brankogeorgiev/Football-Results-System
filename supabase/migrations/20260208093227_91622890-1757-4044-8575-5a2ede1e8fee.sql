
-- Drop the existing admin-only insert policy
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;

-- Create a new policy allowing users to insert their own non-admin role, or admins to insert any role
CREATE POLICY "Users can insert own role or admins can insert any"
ON public.user_roles
FOR INSERT
WITH CHECK (
  (auth.uid() = user_id AND role = 'user'::app_role)
  OR has_role(auth.uid(), 'admin'::app_role)
);
