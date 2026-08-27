-- 1. PROFILES
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name text,
  email text,
  locale text NOT NULL DEFAULT 'fr',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "self read profile" ON public.profiles
  FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "self insert profile" ON public.profiles
  FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "self update profile" ON public.profiles
  FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- 2. SCENARIO USAGE (anti-repetition / weighted rotation)
CREATE TABLE public.scenario_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id text NOT NULL DEFAULT 'ch1',
  level text NOT NULL,
  scenario_id text NOT NULL,
  usage_count integer NOT NULL DEFAULT 1,
  last_used_at timestamptz NOT NULL DEFAULT now(),
  cooldown_until timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, chapter_id, scenario_id)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.scenario_usage TO authenticated;
GRANT ALL ON public.scenario_usage TO service_role;

ALTER TABLE public.scenario_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "self manage scenario usage" ON public.scenario_usage
  FOR ALL TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE INDEX scenario_usage_user_level_idx ON public.scenario_usage (user_id, chapter_id, level);

-- 3. PLATFORM FLAGS (server-controlled trial window)
CREATE TABLE public.platform_flags (
  key text PRIMARY KEY,
  enabled boolean NOT NULL DEFAULT false,
  value jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.platform_flags TO anon, authenticated;
GRANT ALL ON public.platform_flags TO service_role;

ALTER TABLE public.platform_flags ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anyone reads flags" ON public.platform_flags
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "admins manage flags" ON public.platform_flags
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

INSERT INTO public.platform_flags (key, enabled, value)
VALUES ('trial_elite_open', true, '{"label":"Trial Elite","unlimited_attempts":true}'::jsonb);

-- 4. updated_at triggers
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_scenario_usage_updated_at BEFORE UPDATE ON public.scenario_usage
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Auto-create a profile on signup (and on anonymous -> account upgrade)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, display_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', split_part(COALESCE(NEW.email, ''), '@', 1))
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();