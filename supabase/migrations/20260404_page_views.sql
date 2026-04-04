-- ============================================================
-- AI4U Academy — Contador de Vistas
-- Ejecutar en Supabase: Dashboard → SQL Editor → Run
-- ============================================================

-- 1. Tabla principal
CREATE TABLE IF NOT EXISTS public.page_views (
    id          bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    page        text        NOT NULL,
    session_id  uuid        NOT NULL,
    visited_at  timestamptz NOT NULL DEFAULT now(),
    referrer    text
);

-- 2. Índices para queries rápidas
CREATE INDEX IF NOT EXISTS idx_pv_visited_at ON public.page_views (visited_at DESC);
CREATE INDEX IF NOT EXISTS idx_pv_page       ON public.page_views (page);
CREATE INDEX IF NOT EXISTS idx_pv_session    ON public.page_views (session_id);

-- 3. Row Level Security
ALTER TABLE public.page_views ENABLE ROW LEVEL SECURITY;

-- Anónimos y autenticados pueden INSERTAR (tracking)
CREATE POLICY "pv_insert"
    ON public.page_views FOR INSERT
    TO anon, authenticated
    WITH CHECK (true);

-- Solo autenticados pueden LEER (panel admin)
CREATE POLICY "pv_select"
    ON public.page_views FOR SELECT
    TO authenticated
    USING (true);

-- ============================================================
-- 4. Función RPC para analítica del admin
--    Retorna: totales + vistas por día (últimos 30 días) + por página
-- ============================================================
CREATE OR REPLACE FUNCTION public.get_pageview_stats()
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result json;
BEGIN
    SELECT json_build_object(
        'total_all_time',  (SELECT COUNT(*) FROM public.page_views),
        'total_today',     (SELECT COUNT(*) FROM public.page_views
                            WHERE visited_at >= date_trunc('day', now())),
        'total_week',      (SELECT COUNT(*) FROM public.page_views
                            WHERE visited_at >= now() - interval '7 days'),
        'total_month',     (SELECT COUNT(*) FROM public.page_views
                            WHERE visited_at >= now() - interval '30 days'),
        'by_day',          (
            SELECT json_agg(row_to_json(d) ORDER BY d.day)
            FROM (
                SELECT
                    to_char(date_trunc('day', visited_at) AT TIME ZONE 'America/Mexico_City', 'YYYY-MM-DD') AS day,
                    COUNT(*) AS views
                FROM public.page_views
                WHERE visited_at >= now() - interval '30 days'
                GROUP BY date_trunc('day', visited_at)
                ORDER BY date_trunc('day', visited_at)
            ) d
        ),
        'by_page',         (
            SELECT json_agg(row_to_json(p) ORDER BY p.views DESC)
            FROM (
                SELECT page, COUNT(*) AS views
                FROM public.page_views
                GROUP BY page
                ORDER BY views DESC
            ) p
        )
    ) INTO result;

    RETURN result;
END;
$$;

-- Permitir que usuarios autenticados llamen a esta función
GRANT EXECUTE ON FUNCTION public.get_pageview_stats() TO authenticated;
