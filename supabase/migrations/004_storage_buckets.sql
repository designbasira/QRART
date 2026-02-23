-- =====================================================
-- QRART - Storage Buckets
-- =====================================================

INSERT INTO storage.buckets (id, name, public) VALUES ('originals', 'originals', false);
INSERT INTO storage.buckets (id, name, public) VALUES ('silhouettes', 'silhouettes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('qrcodes', 'qrcodes', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('composites', 'composites', true);
INSERT INTO storage.buckets (id, name, public) VALUES ('user-media', 'user-media', true);

-- Storage policies for originals (admin only upload)
CREATE POLICY "Admins can upload originals"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'originals' AND
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Storage policies for user-media (authenticated users)
CREATE POLICY "Users can upload own media"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'user-media' AND
    auth.uid() IS NOT NULL
  );

-- Public read for public buckets
CREATE POLICY "Public read for public buckets"
  ON storage.objects FOR SELECT
  USING (
    bucket_id IN ('silhouettes', 'qrcodes', 'composites', 'user-media')
  );
