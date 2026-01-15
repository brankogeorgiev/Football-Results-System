-- Add RLS policy to allow anyone to read/download from data-exports bucket
CREATE POLICY "Allow public read access to data-exports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'data-exports');

-- Allow listing files in the bucket
CREATE POLICY "Allow public list access to data-exports"
ON storage.objects
FOR SELECT
USING (bucket_id = 'data-exports');