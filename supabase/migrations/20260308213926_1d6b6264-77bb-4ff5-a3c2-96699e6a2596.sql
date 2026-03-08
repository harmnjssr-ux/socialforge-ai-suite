
CREATE TABLE public.scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_id uuid NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  platform text NOT NULL,
  content_type text NOT NULL DEFAULT 'image',
  media_url text,
  caption text,
  hashtags text,
  scheduled_at timestamp with time zone NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.scheduled_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view scheduled posts for their companies"
ON public.scheduled_posts FOR SELECT TO authenticated
USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = scheduled_posts.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Users can create scheduled posts for their companies"
ON public.scheduled_posts FOR INSERT TO authenticated
WITH CHECK (EXISTS (SELECT 1 FROM companies WHERE companies.id = scheduled_posts.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Users can update scheduled posts for their companies"
ON public.scheduled_posts FOR UPDATE TO authenticated
USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = scheduled_posts.company_id AND companies.user_id = auth.uid()));

CREATE POLICY "Users can delete scheduled posts for their companies"
ON public.scheduled_posts FOR DELETE TO authenticated
USING (EXISTS (SELECT 1 FROM companies WHERE companies.id = scheduled_posts.company_id AND companies.user_id = auth.uid()));
