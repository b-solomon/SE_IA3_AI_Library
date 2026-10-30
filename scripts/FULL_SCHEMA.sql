-- ============================================================
-- AI Digital Library Management System
-- Initial Schema Migration
-- Student: BODDU SOLOMON | URK25CS1191 | 25CS312
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES (extends auth.users)
-- ============================================================
CREATE TABLE public.profiles (
    id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name   TEXT NOT NULL,
    role        TEXT NOT NULL DEFAULT 'student'
                    CHECK (role IN ('student', 'admin')),
    avatar_url  TEXT,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at  TIMESTAMPTZ
);

-- Auto-create profile on user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        'student'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ============================================================
-- 2. CATEGORIES
-- ============================================================
CREATE TABLE public.categories (
    id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name        TEXT UNIQUE NOT NULL,
    description TEXT,
    icon        TEXT,
    created_by  UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 3. DIGITAL ASSETS
-- ============================================================
CREATE TABLE public.digital_assets (
    id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title          TEXT NOT NULL,
    author         TEXT NOT NULL,
    isbn           TEXT,
    description    TEXT,
    category_id    UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    file_path      TEXT,
    file_name      TEXT,
    file_size      BIGINT,
    file_type      TEXT CHECK (file_type IN ('application/pdf', 'application/epub+zip')),
    cover_url      TEXT,
    tags           TEXT[] DEFAULT '{}',
    is_published   BOOLEAN DEFAULT FALSE NOT NULL,
    download_count INT DEFAULT 0 NOT NULL,
    uploaded_by    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at     TIMESTAMPTZ
);

-- Index for full-text search
CREATE INDEX idx_digital_assets_title ON public.digital_assets USING gin(to_tsvector('english', title));
CREATE INDEX idx_digital_assets_tags  ON public.digital_assets USING gin(tags);

-- ============================================================
-- 4. AI CONVERSATIONS
-- ============================================================
CREATE TABLE public.conversations (
    id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title      TEXT NOT NULL DEFAULT 'New Conversation',
    created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 5. CHAT MESSAGES
-- ============================================================
CREATE TABLE public.chat_messages (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    role            TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content         TEXT NOT NULL,
    model_used      TEXT,
    tokens_used     INT,
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX idx_chat_messages_conversation ON public.chat_messages(conversation_id);

-- ============================================================
-- 6. TEST CASES (SE Lab)
-- ============================================================
CREATE TABLE public.test_cases (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    test_id         TEXT UNIQUE NOT NULL,
    requirement_id  TEXT,
    category        TEXT NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    preconditions   TEXT,
    input_data      JSONB,
    expected_output TEXT NOT NULL,
    test_type       TEXT NOT NULL CHECK (test_type IN ('black-box', 'white-box')),
    severity        TEXT NOT NULL CHECK (severity IN ('critical', 'high', 'medium', 'low')),
    created_at      TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- ============================================================
-- 7. TEST RUNS
-- ============================================================
CREATE TABLE public.test_runs (
    id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_label    TEXT NOT NULL,
    run_by       UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    started_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    completed_at TIMESTAMPTZ,
    total        INT NOT NULL DEFAULT 0,
    passed       INT NOT NULL DEFAULT 0,
    failed       INT NOT NULL DEFAULT 0,
    skipped      INT NOT NULL DEFAULT 0,
    branch       TEXT,
    commit_sha   TEXT
);

-- ============================================================
-- 8. TEST RESULTS
-- ============================================================
CREATE TABLE public.test_results (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_id          UUID NOT NULL REFERENCES public.test_runs(id) ON DELETE CASCADE,
    test_case_id    UUID REFERENCES public.test_cases(id) ON DELETE SET NULL,
    status          TEXT NOT NULL CHECK (status IN ('pass', 'fail', 'skip', 'example')),
    actual_output   TEXT,
    error_details   TEXT,
    duration_ms     INT,
    executed_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    evidence_url    TEXT
);

-- ============================================================
-- 9. DEFECTS
-- ============================================================
CREATE TABLE public.defects (
    id                      UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    defect_id               TEXT UNIQUE NOT NULL,
    title                   TEXT NOT NULL,
    description             TEXT,
    severity                TEXT,
    priority                TEXT,
    status                  TEXT NOT NULL DEFAULT 'new'
                                CHECK (status IN ('new','triaged','in_progress','fixed','retested','closed')),
    related_test_result_id  UUID REFERENCES public.test_results(id) ON DELETE SET NULL,
    reported_by             UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    assigned_to             UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at              TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    updated_at              TIMESTAMPTZ
);

-- ============================================================
-- 10. CHANGE RECORDS (SCM)
-- ============================================================
CREATE TABLE public.change_records (
    id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    record_id       TEXT NOT NULL,
    change_type     TEXT NOT NULL,
    description     TEXT NOT NULL,
    affected_files  TEXT[],
    author          UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    committed_at    TIMESTAMPTZ DEFAULT NOW() NOT NULL,
    version_tag     TEXT,
    notes           TEXT
);

-- ============================================================
-- RPC: Increment download count (safe, avoids race conditions)
-- ============================================================
CREATE OR REPLACE FUNCTION public.increment_download_count(asset_id UUID)
RETURNS VOID AS $$
    UPDATE public.digital_assets
    SET download_count = download_count + 1,
        updated_at     = NOW()
    WHERE id = asset_id;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.digital_assets    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_cases        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_runs         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.test_results      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.defects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.change_records    ENABLE ROW LEVEL SECURITY;

-- Helper: is current user admin?
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
    SELECT EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND role = 'admin'
    );
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- --- PROFILES ---
CREATE POLICY "profiles_select_own"    ON public.profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "profiles_select_admin"  ON public.profiles FOR SELECT USING (public.is_admin());
CREATE POLICY "profiles_update_own"    ON public.profiles FOR UPDATE USING (id = auth.uid());
CREATE POLICY "profiles_update_admin"  ON public.profiles FOR UPDATE USING (public.is_admin());

-- --- CATEGORIES ---
CREATE POLICY "categories_select_all"  ON public.categories FOR SELECT USING (TRUE);
CREATE POLICY "categories_write_admin" ON public.categories FOR ALL    USING (public.is_admin());

-- --- DIGITAL ASSETS ---
CREATE POLICY "assets_select_published" ON public.digital_assets FOR SELECT
    USING (is_published = TRUE OR public.is_admin());
CREATE POLICY "assets_write_admin"      ON public.digital_assets FOR ALL USING (public.is_admin());

-- --- CONVERSATIONS ---
CREATE POLICY "conv_own"   ON public.conversations FOR ALL USING (user_id = auth.uid() OR public.is_admin());

-- --- CHAT MESSAGES ---
CREATE POLICY "msg_own"    ON public.chat_messages FOR ALL
    USING (
        conversation_id IN (
            SELECT id FROM public.conversations
            WHERE user_id = auth.uid()
        )
        OR public.is_admin()
    );

-- --- SE LAB TABLES: admins full, students read ---
CREATE POLICY "tc_read"  ON public.test_cases    FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "tc_write" ON public.test_cases    FOR ALL    USING (public.is_admin());
CREATE POLICY "tr_read"  ON public.test_runs     FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "tr_write" ON public.test_runs     FOR ALL    USING (auth.uid() IS NOT NULL);
CREATE POLICY "tres_read" ON public.test_results FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "tres_write" ON public.test_results FOR ALL   USING (auth.uid() IS NOT NULL);
CREATE POLICY "def_read" ON public.defects       FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "def_write" ON public.defects      FOR ALL    USING (public.is_admin());
CREATE POLICY "cr_read"  ON public.change_records FOR SELECT USING (auth.uid() IS NOT NULL);
CREATE POLICY "cr_write" ON public.change_records FOR ALL   USING (public.is_admin());


-- ============ STORAGE BUCKETS ============

-- ============================================================
-- Storage Buckets
-- documents â€” private, authenticated access only
-- covers    â€” public, read by anyone
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


-- ============ SEED DATA ============

-- Default categories seed
INSERT INTO public.categories (name, description, icon) VALUES
    ('Computer Science',     'Core CS: algorithms, data structures, OS, networks', 'ðŸ’»'),
    ('Software Engineering', 'SE process, design patterns, testing, architecture', 'âš™ï¸'),
    ('Artificial Intelligence', 'Machine learning, deep learning, NLP, computer vision', 'ðŸ¤–'),
    ('Mathematics',          'Calculus, linear algebra, discrete math, statistics', 'ðŸ“'),
    ('Physics',              'Classical mechanics, electromagnetism, quantum physics', 'âš›ï¸'),
    ('Data Science',         'Data analysis, visualization, pandas, R, statistics', 'ðŸ“Š'),
    ('Electronics',          'Circuits, digital systems, embedded systems, VLSI', 'ðŸ”Œ'),
    ('Research Papers',      'Academic journals, conference papers, preprints', 'ðŸ“„')
ON CONFLICT (name) DO NOTHING;

