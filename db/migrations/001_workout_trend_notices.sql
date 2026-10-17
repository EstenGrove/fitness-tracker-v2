-- AI trend notices: one cached notice per user per completed week
-- - Safe to re-run (IF NOT EXISTS); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp"; -- uuid_generate_v4()

CREATE TABLE IF NOT EXISTS
  workout_trend_notices (
    notice_id UUID PRIMARY KEY DEFAULT uuid_generate_v4 (),
    user_id UUID NOT NULL REFERENCES users (user_id) ON DELETE CASCADE,
    week_start DATE NOT NULL,
    direction TEXT NOT NULL CHECK (direction IN ('POSITIVE', 'NEGATIVE', 'MIXED')),
    metrics JSONB NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    generated_by TEXT NOT NULL CHECK (generated_by IN ('AI', 'TEMPLATE')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW (),
    dismissed_at TIMESTAMPTZ,
    UNIQUE (user_id, week_start)
  );
