-- =====================================================
-- QRART - Row Level Security Policies
-- =====================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scan_logs ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES
-- =====================================================
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON public.profiles FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- =====================================================
-- DESIGNS
-- =====================================================
CREATE POLICY "Owners can view own designs"
  ON public.designs FOR SELECT
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can view all designs"
  ON public.designs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can insert designs"
  ON public.designs FOR INSERT
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can update any design"
  ON public.designs FOR UPDATE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Owners can update own design content"
  ON public.designs FOR UPDATE
  USING (owner_id = auth.uid());

CREATE POLICY "Admins can delete designs"
  ON public.designs FOR DELETE
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- =====================================================
-- INTEGRATIONS
-- =====================================================
CREATE POLICY "Users manage own integrations"
  ON public.integrations FOR ALL
  USING (user_id = auth.uid());

-- =====================================================
-- SCAN_LOGS
-- =====================================================
CREATE POLICY "Anyone can insert scan logs"
  ON public.scan_logs FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can view scan logs"
  ON public.scan_logs FOR SELECT
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );
