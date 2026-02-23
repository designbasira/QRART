-- =====================================================
-- QRART - Silhouette QR Live - Initial Schema
-- =====================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_profiles_role ON public.profiles(role);

-- =====================================================
-- DESIGNS TABLE (core entity)
-- =====================================================
CREATE TABLE public.designs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  short_id TEXT UNIQUE NOT NULL,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT DEFAULT 'Untitled Design',

  -- Image assets (Supabase Storage URLs)
  original_image_url TEXT,
  silhouette_image_url TEXT,
  qr_code_url TEXT,
  final_composite_url TEXT,

  -- Dynamic content (what the QR resolves to)
  current_message TEXT DEFAULT '',
  current_media_url TEXT,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'link')),

  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  is_published BOOLEAN DEFAULT FALSE,

  -- Metadata
  scan_count INTEGER DEFAULT 0,
  last_scanned_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_designs_owner ON public.designs(owner_id);
CREATE INDEX idx_designs_short_id ON public.designs(short_id);
CREATE INDEX idx_designs_active ON public.designs(is_active, is_published);

-- =====================================================
-- INTEGRATIONS TABLE (cloud storage links)
-- =====================================================
CREATE TABLE public.integrations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  design_id UUID REFERENCES public.designs(id) ON DELETE SET NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google_drive', 'dropbox', 'onedrive')),
  share_link TEXT NOT NULL,
  label TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_integrations_user ON public.integrations(user_id);
CREATE INDEX idx_integrations_design ON public.integrations(design_id);

-- =====================================================
-- SCAN LOG TABLE (analytics)
-- =====================================================
CREATE TABLE public.scan_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  design_id UUID NOT NULL REFERENCES public.designs(id) ON DELETE CASCADE,
  scanned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  ip_address INET,
  user_agent TEXT,
  referer TEXT
);

CREATE INDEX idx_scan_logs_design ON public.scan_logs(design_id);
CREATE INDEX idx_scan_logs_time ON public.scan_logs(scanned_at DESC);

-- =====================================================
-- UPDATED_AT TRIGGER FUNCTION
-- =====================================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_designs_updated_at
  BEFORE UPDATE ON public.designs
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- =====================================================
-- INCREMENT SCAN COUNT RPC
-- =====================================================
CREATE OR REPLACE FUNCTION increment_scan_count(p_design_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.designs
  SET scan_count = scan_count + 1,
      last_scanned_at = NOW()
  WHERE id = p_design_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
