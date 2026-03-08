
-- Create media_assets table
CREATE TABLE public.media_assets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'image',
  url TEXT NOT NULL,
  prompt TEXT,
  platform_preset TEXT,
  style TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;

-- RLS policies via company ownership
CREATE POLICY "Users can view media for their companies"
  ON public.media_assets FOR SELECT
  TO authenticated
  USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = media_assets.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Users can create media for their companies"
  ON public.media_assets FOR INSERT
  TO authenticated
  WITH CHECK (EXISTS (SELECT 1 FROM companies WHERE companies.id = media_assets.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Users can delete media for their companies"
  ON public.media_assets FOR DELETE
  TO authenticated
  USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = media_assets.company_id AND companies.user_id = auth.uid()));

-- Create media-library storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('media-library', 'media-library', true);

-- Storage policies
CREATE POLICY "Users can upload media" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'media-library');

CREATE POLICY "Anyone can view media" ON storage.objects FOR SELECT TO public
  USING (bucket_id = 'media-library');

CREATE POLICY "Users can delete their media" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'media-library');
