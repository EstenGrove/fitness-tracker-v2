CREATE TABLE
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