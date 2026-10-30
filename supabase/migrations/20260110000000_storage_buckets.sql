-- ============================================================
-- Storage Buckets
-- documents — private, authenticated access only
-- covers    — public, read by anyone
-- ============================================================

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
    ('documents', 'documents', FALSE, 52428800, ARRAY['application/pdf', 'application/epub+zip']),
    ('covers',    'covers',    TRUE,  5242880,  ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: documents bucket
CREATE POLICY "doc_download_authenticated"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents' AND auth.uid() IS NOT NULL);

CREATE POLICY "doc_upload_admin"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "doc_delete_admin"
    ON storage.objects FOR DELETE
    USING (
        bucket_id = 'documents'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Storage RLS: covers bucket (public read)
CREATE POLICY "covers_read_all"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'covers');

CREATE POLICY "covers_upload_admin"
    ON storage.objects FOR INSERT
    WITH CHECK (
        bucket_id = 'covers'
        AND EXISTS (
            SELECT 1 FROM public.profiles
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
