-- Create a storage bucket for data exports
INSERT INTO storage.buckets (id, name, public)
VALUES ('data-exports', 'data-exports', false);

-- Allow service role to manage files (for edge function)
CREATE POLICY "Service role can manage exports"
ON storage.objects
FOR ALL
USING (bucket_id = 'data-exports')
WITH CHECK (bucket_id = 'data-exports');