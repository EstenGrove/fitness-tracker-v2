-- Trends Hub (/trends): Phase 1 categories (consistency, volume, adherence)
-- - Periods are whole, COMPLETED Sunday-Saturday weeks (same convention as 'get_weekly_workout_totals')
-- - Every category returns the current period + the equal-length period before it, for comparisons
-- - Depends on: week_start_sunday() (000), v_workout_history
-- - Safe to re-run (CREATE OR REPLACE); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)


  -- HELPERS

  -- Date bounds for a period of 'numOfWeeks' completed weeks, plus the equal-length prior period.
  -- eg. asOfDate = 2026-10-11 (Sun), numOfWeeks = 4:
  --   lastWeekStart = 2026-10-04, firstWeekStart = 2026-09-13, priorFirstWeekStart = 2026-08-16
  CREATE OR REPLACE FUNCTION get_trend_period_bounds (
      asOfDate DATE,
      numOfWeeks INT
  )
  RETURNS TABLE (
      last_week_start DATE,
      first_week_start DATE,
      prior_first_week_start DATE
  )
  LANGUAGE sql
  IMMUTABLE
  AS $$
    SELECT week_start_sunday(asOfDate) - 7                   AS last_week_start,        -- most recent COMPLETED week
           week_start_sunday(asOfDate) - 7 * numOfWeeks       AS first_week_start,       -- start of the current period
           week_start_sunday(asOfDate) - 7 * numOfWeeks * 2   AS prior_first_week_start; -- start of the prior period
  $$;

  -- Name & target duration for every workout across the activity tables.
  -- - Includes inactive (deleted) workouts, so past sessions still resolve
  -- - 'workout_id' is only unique per activity table: always join on (activity_type, workout_id)
  CREATE OR REPLACE FUNCTION get_trends_workout_details (
      userID UUID
  )
  RETURNS TABLE (
      activity_type TEXT,
      workout_id INT,
      workout_name TEXT,
      target_duration NUMERIC
  )
  LANGUAGE sql
  STABLE
  AS $$
    SELECT 'Strength', w.workout_id, w.workout_name, w.duration FROM strength_workouts w WHERE w.user_id = userID
    UNION ALL
    SELECT 'Stretch',  w.workout_id, w.workout_name, w.duration FROM stretch_workouts w  WHERE w.user_id = userID
    UNION ALL
    SELECT 'Cardio',   w.workout_id, w.workout_name, w.duration FROM cardio_workouts w   WHERE w.user_id = userID
    UNION ALL
    SELECT 'Walk',     w.workout_id, w.workout_name, w.duration FROM walk_workouts w     WHERE w.user_id = userID
    UNION ALL
    SELECT 'Timed',    w.workout_id, w.workout_name, w.duration FROM timed_workouts w    WHERE w.user_id = userID
    UNION ALL
    SELECT 'Other',    w.workout_id, w.workout_name, w.duration FROM other_workouts w    WHERE w.user_id = userID;
  $$;


  -- CONSISTENCY
  -- How often the user trains: active days, workouts per week, longest streak, and when they train.
  CREATE OR REPLACE FUNCTION get_trends_consistency (
      userID UUID,
      asOfDate DATE DEFAULT CURRENT_DATE,
      numOfWeeks INT DEFAULT 12
  )
  RETURNS JSONB
  LANGUAGE sql
  STABLE
  AS $$
    WITH bounds AS (
      SELECT * FROM get_trend_period_bounds(asOfDate, numOfWeeks)
    ),
    history AS MATERIALIZED (
      -- Every session in the current + prior periods, tagged by period
      SELECT h.workout_date,
             EXTRACT(HOUR FROM h.start_time AT TIME ZONE 'America/Phoenix')::INT AS start_hour,
             CASE WHEN h.workout_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period
      FROM   v_workout_history h, bounds b
      WHERE  h.user_id = userID
        AND  h.workout_date >= b.prior_first_week_start
        AND  h.workout_date <  b.last_week_start + 7
    ),
    active_days AS (
      SELECT DISTINCT period, workout_date FROM history
    ),
    streaks AS (
      -- Gaps & islands: consecutive dates share the same (date - row number)
      SELECT period, COUNT(*) AS streak_days
      FROM (
        SELECT period,
               workout_date - (ROW_NUMBER() OVER (PARTITION BY period ORDER BY workout_date))::INT AS island
        FROM   active_days
      ) islands
      GROUP  BY period, island
    ),
    period_totals AS (
      SELECT p.period,
             (SELECT COUNT(*) FROM history h     WHERE h.period = p.period)                   AS workouts,
             (SELECT COUNT(*) FROM active_days a WHERE a.period = p.period)                   AS active_days,
             (SELECT COALESCE(MAX(s.streak_days), 0) FROM streaks s WHERE s.period = p.period) AS longest_streak
      FROM   (VALUES ('current'), ('prior')) AS p(period)
    ),
    weeks AS (
      -- One row per week of the current period, including weeks with no workouts
      SELECT (b.first_week_start + 7 * g)::DATE AS week_start
      FROM   bounds b, generate_series(0, numOfWeeks - 1) g
    ),
    week_totals AS (
      SELECT week_start_sunday(workout_date) AS week_start,
             COUNT(*)                        AS workouts,
             COUNT(DISTINCT workout_date)    AS active_days
      FROM   history
      WHERE  period = 'current'
      GROUP  BY 1
    ),
    day_totals AS (
      -- 0 = Sunday ... 6 = Saturday
      SELECT EXTRACT(DOW FROM workout_date)::INT AS day_of_week,
             COUNT(*)                            AS workouts
      FROM   history
      WHERE  period = 'current'
      GROUP  BY 1
    ),
    day_hour_totals AS (
      -- Sparse (non-zero buckets only); the client fills the grid
      SELECT EXTRACT(DOW FROM workout_date)::INT AS day_of_week,
             start_hour                          AS hour,
             COUNT(*)                            AS workouts
      FROM   history
      WHERE  period = 'current' AND start_hour IS NOT NULL
      GROUP  BY 1, 2
    )
    SELECT jsonb_build_object(
      'period', jsonb_build_object(
        'startDate',     b.first_week_start,
        'endDate',       b.last_week_start + 6,
        'lastWeekStart', b.last_week_start,
        'weeks',         numOfWeeks
      ),
      'priorPeriod', jsonb_build_object(
        'startDate', b.prior_first_week_start,
        'endDate',   b.first_week_start - 1
      ),
      'firstWorkoutDate', (SELECT MIN(workout_date) FROM v_workout_history WHERE user_id = userID),
      'current', (
        SELECT jsonb_build_object(
          'workouts',      t.workouts,
          'activeDays',    t.active_days,
          'totalDays',     numOfWeeks * 7,
          'longestStreak', t.longest_streak
        ) FROM period_totals t WHERE t.period = 'current'
      ),
      'prior', (
        SELECT jsonb_build_object(
          'workouts',      t.workouts,
          'activeDays',    t.active_days,
          'totalDays',     numOfWeeks * 7,
          'longestStreak', t.longest_streak
        ) FROM period_totals t WHERE t.period = 'prior'
      ),
      'weeks', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'weekStart',  w.week_start,
                 'workouts',   COALESCE(wt.workouts, 0),
                 'activeDays', COALESCE(wt.active_days, 0)
               ) ORDER BY w.week_start), '[]'::JSONB)
        FROM   weeks w
        LEFT   JOIN week_totals wt USING (week_start)
      ),
      'byDayOfWeek', (
        SELECT jsonb_agg(jsonb_build_object(
                 'dayOfWeek', d.day_of_week,
                 'workouts',  COALESCE(dt.workouts, 0)
               ) ORDER BY d.day_of_week)
        FROM   generate_series(0, 6) AS d(day_of_week)
        LEFT   JOIN day_totals dt USING (day_of_week)
      ),
      'byDayAndHour', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'dayOfWeek', dh.day_of_week,
                 'hour',      dh.hour,
                 'workouts',  dh.workouts
               ) ORDER BY dh.day_of_week, dh.hour), '[]'::JSONB)
        FROM   day_hour_totals dh
      )
    )
    FROM bounds b;
  $$;


  -- VOLUME
  -- How much the user trains: minutes, sessions, session length vs target, and the activity mix.
  CREATE OR REPLACE FUNCTION get_trends_volume (
      userID UUID,
      asOfDate DATE DEFAULT CURRENT_DATE,
      numOfWeeks INT DEFAULT 12
  )
  RETURNS JSONB
  LANGUAGE sql
  STABLE
  AS $$
    WITH bounds AS (
      SELECT * FROM get_trend_period_bounds(asOfDate, numOfWeeks)
    ),
    history AS MATERIALIZED (
      -- Every session in the current + prior periods, with its workout's target duration
      SELECT h.workout_date,
             h.activity_type,
             h.duration AS mins,
             NULLIF(wd.target_duration, 0) AS target_mins, -- 0 = no target set
             CASE WHEN h.workout_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period
      FROM   v_workout_history h
      CROSS  JOIN bounds b
      LEFT   JOIN get_trends_workout_details(userID) wd
             ON wd.activity_type = h.activity_type AND wd.workout_id = h.workout_id
      WHERE  h.user_id = userID
        AND  h.workout_date >= b.prior_first_week_start
        AND  h.workout_date <  b.last_week_start + 7
    ),
    period_totals AS (
      SELECT p.period,
             COUNT(h.workout_date)                                   AS workouts,
             COALESCE(SUM(h.mins), 0)                                AS total_mins,
             AVG(h.mins)                                             AS avg_session_mins,
             -- Target comparisons only use sessions whose workout has a target
             COUNT(h.target_mins)                                    AS targeted_workouts,
             COALESCE(SUM(h.mins) FILTER (WHERE h.target_mins IS NOT NULL), 0) AS targeted_mins,
             COALESCE(SUM(h.target_mins), 0)                         AS target_mins
      FROM   (VALUES ('current'), ('prior')) AS p(period)
      LEFT   JOIN history h ON h.period = p.period
      GROUP  BY p.period
    ),
    weeks AS (
      SELECT (b.first_week_start + 7 * g)::DATE AS week_start
      FROM   bounds b, generate_series(0, numOfWeeks - 1) g
    ),
    week_totals AS (
      SELECT week_start_sunday(workout_date) AS week_start,
             SUM(mins)                       AS total_mins,
             COUNT(*)                        AS workouts
      FROM   history
      WHERE  period = 'current'
      GROUP  BY 1
    ),
    week_activity_totals AS (
      -- Sparse (non-zero only), for the stacked chart
      SELECT week_start_sunday(workout_date) AS week_start,
             activity_type,
             SUM(mins)                       AS total_mins
      FROM   history
      WHERE  period = 'current'
      GROUP  BY 1, 2
    ),
    activity_totals AS (
      SELECT activity_type,
             COALESCE(SUM(mins) FILTER (WHERE period = 'current'), 0) AS current_mins,
             COUNT(*)           FILTER (WHERE period = 'current')     AS current_workouts,
             COALESCE(SUM(mins) FILTER (WHERE period = 'prior'), 0)   AS prior_mins,
             COUNT(*)           FILTER (WHERE period = 'prior')       AS prior_workouts
      FROM   history
      GROUP  BY 1
    )
    SELECT jsonb_build_object(
      'period', jsonb_build_object(
        'startDate',     b.first_week_start,
        'endDate',       b.last_week_start + 6,
        'lastWeekStart', b.last_week_start,
        'weeks',         numOfWeeks
      ),
      'priorPeriod', jsonb_build_object(
        'startDate', b.prior_first_week_start,
        'endDate',   b.first_week_start - 1
      ),
      'firstWorkoutDate', (SELECT MIN(workout_date) FROM v_workout_history WHERE user_id = userID),
      'current', (
        SELECT jsonb_build_object(
          'workouts',         t.workouts,
          'totalMins',        ROUND(t.total_mins, 1),
          'avgSessionMins',   ROUND(t.avg_session_mins, 1),
          'targetedWorkouts', t.targeted_workouts,
          'targetedMins',     ROUND(t.targeted_mins, 1),
          'targetMins',       ROUND(t.target_mins, 1)
        ) FROM period_totals t WHERE t.period = 'current'
      ),
      'prior', (
        SELECT jsonb_build_object(
          'workouts',         t.workouts,
          'totalMins',        ROUND(t.total_mins, 1),
          'avgSessionMins',   ROUND(t.avg_session_mins, 1),
          'targetedWorkouts', t.targeted_workouts,
          'targetedMins',     ROUND(t.targeted_mins, 1),
          'targetMins',       ROUND(t.target_mins, 1)
        ) FROM period_totals t WHERE t.period = 'prior'
      ),
      'weeks', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'weekStart', w.week_start,
                 'totalMins', ROUND(COALESCE(wt.total_mins, 0), 1),
                 'workouts',  COALESCE(wt.workouts, 0)
               ) ORDER BY w.week_start), '[]'::JSONB)
        FROM   weeks w
        LEFT   JOIN week_totals wt USING (week_start)
      ),
      'weeksByActivity', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'weekStart',    wa.week_start,
                 'activityType', wa.activity_type,
                 'totalMins',    ROUND(wa.total_mins, 1)
               ) ORDER BY wa.week_start, wa.activity_type), '[]'::JSONB)
        FROM   week_activity_totals wa
      ),
      'byActivity', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'activityType',    a.activity_type,
                 'currentMins',     ROUND(a.current_mins, 1),
                 'currentWorkouts', a.current_workouts,
                 'priorMins',       ROUND(a.prior_mins, 1),
                 'priorWorkouts',   a.prior_workouts
               ) ORDER BY a.current_mins DESC), '[]'::JSONB)
        FROM   activity_totals a
      )
    )
    FROM bounds b;
  $$;


  -- ADHERENCE
  -- How well the user sticks to their schedule: scheduled vs completed vs skipped vs missed.
  -- - A scheduled date counts as 'completed' only if the same workout was logged on that same date
  -- - Precedence: completed > skipped > missed
  -- - Inactive (deleted) schedules are ignored, so removed plans don't count as misses
  CREATE OR REPLACE FUNCTION get_trends_adherence (
      userID UUID,
      asOfDate DATE DEFAULT CURRENT_DATE,
      numOfWeeks INT DEFAULT 12
  )
  RETURNS JSONB
  LANGUAGE sql
  STABLE
  AS $$
    WITH bounds AS (
      SELECT * FROM get_trend_period_bounds(asOfDate, numOfWeeks)
    ),
    scheduled AS (
      -- One row per scheduled workout per date (DISTINCT: overlapping schedules count once)
      SELECT DISTINCT s.activity_type,
             s.workout_id,
             d.scheduled_date
      FROM   workout_schedules s
      JOIN   workout_dates wd ON wd.schedule_id = s.schedule_id
      CROSS  JOIN LATERAL unnest(wd.dates) AS d(scheduled_date)
      CROSS  JOIN bounds b
      WHERE  s.user_id = userID
        AND  s.is_active = true
        AND  d.scheduled_date >= b.prior_first_week_start
        AND  d.scheduled_date <  b.last_week_start + 7
    ),
    completed AS MATERIALIZED (
      SELECT DISTINCT h.activity_type, h.workout_id, h.workout_date
      FROM   v_workout_history h, bounds b
      WHERE  h.user_id = userID
        AND  h.workout_date >= b.prior_first_week_start
        AND  h.workout_date <  b.last_week_start + 7
    ),
    skipped AS (
      -- 'skipped_workouts' has no user_id; matching on the user's own scheduled workouts scopes it
      SELECT DISTINCT sk.activity_type, sk.workout_id, sk.workout_date
      FROM   skipped_workouts sk
      WHERE  sk.is_active = true
    ),
    outcomes AS (
      SELECT sc.activity_type,
             sc.workout_id,
             sc.scheduled_date,
             CASE WHEN sc.scheduled_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period,
             CASE
               WHEN c.workout_date  IS NOT NULL THEN 'completed'
               WHEN sk.workout_date IS NOT NULL THEN 'skipped'
               ELSE 'missed'
             END AS outcome
      FROM   scheduled sc
      CROSS  JOIN bounds b
      LEFT   JOIN completed c
             ON  c.activity_type = sc.activity_type
             AND c.workout_id    = sc.workout_id
             AND c.workout_date  = sc.scheduled_date
      LEFT   JOIN skipped sk
             ON  sk.activity_type = sc.activity_type
             AND sk.workout_id    = sc.workout_id
             AND sk.workout_date  = sc.scheduled_date
    ),
    period_totals AS (
      SELECT p.period,
             COUNT(o.outcome)                                AS scheduled,
             COUNT(*) FILTER (WHERE o.outcome = 'completed') AS completed,
             COUNT(*) FILTER (WHERE o.outcome = 'skipped')   AS skipped,
             COUNT(*) FILTER (WHERE o.outcome = 'missed')    AS missed
      FROM   (VALUES ('current'), ('prior')) AS p(period)
      LEFT   JOIN outcomes o ON o.period = p.period
      GROUP  BY p.period
    ),
    weeks AS (
      SELECT (b.first_week_start + 7 * g)::DATE AS week_start
      FROM   bounds b, generate_series(0, numOfWeeks - 1) g
    ),
    week_totals AS (
      SELECT week_start_sunday(scheduled_date)              AS week_start,
             COUNT(*)                                       AS scheduled,
             COUNT(*) FILTER (WHERE outcome = 'completed')  AS completed,
             COUNT(*) FILTER (WHERE outcome = 'skipped')    AS skipped,
             COUNT(*) FILTER (WHERE outcome = 'missed')     AS missed
      FROM   outcomes
      WHERE  period = 'current'
      GROUP  BY 1
    ),
    workout_totals AS (
      SELECT o.activity_type,
             o.workout_id,
             COUNT(*)                                        AS scheduled,
             COUNT(*) FILTER (WHERE o.outcome = 'completed') AS completed,
             COUNT(*) FILTER (WHERE o.outcome = 'skipped')   AS skipped,
             COUNT(*) FILTER (WHERE o.outcome = 'missed')    AS missed
      FROM   outcomes o
      WHERE  o.period = 'current'
      GROUP  BY 1, 2
    )
    SELECT jsonb_build_object(
      'period', jsonb_build_object(
        'startDate',     b.first_week_start,
        'endDate',       b.last_week_start + 6,
        'lastWeekStart', b.last_week_start,
        'weeks',         numOfWeeks
      ),
      'priorPeriod', jsonb_build_object(
        'startDate', b.prior_first_week_start,
        'endDate',   b.first_week_start - 1
      ),
      -- Earliest scheduled date, so callers can tell when the prior period predates any schedule
      'firstScheduledDate', (
        SELECT MIN(d.scheduled_date)
        FROM   workout_schedules s
        JOIN   workout_dates wd ON wd.schedule_id = s.schedule_id
        CROSS  JOIN LATERAL unnest(wd.dates) AS d(scheduled_date)
        WHERE  s.user_id = userID AND s.is_active = true
      ),
      'current', (
        SELECT jsonb_build_object(
          'scheduled', t.scheduled,
          'completed', t.completed,
          'skipped',   t.skipped,
          'missed',    t.missed
        ) FROM period_totals t WHERE t.period = 'current'
      ),
      'prior', (
        SELECT jsonb_build_object(
          'scheduled', t.scheduled,
          'completed', t.completed,
          'skipped',   t.skipped,
          'missed',    t.missed
        ) FROM period_totals t WHERE t.period = 'prior'
      ),
      'weeks', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'weekStart', w.week_start,
                 'scheduled', COALESCE(wt.scheduled, 0),
                 'completed', COALESCE(wt.completed, 0),
                 'skipped',   COALESCE(wt.skipped, 0),
                 'missed',    COALESCE(wt.missed, 0)
               ) ORDER BY w.week_start), '[]'::JSONB)
        FROM   weeks w
        LEFT   JOIN week_totals wt USING (week_start)
      ),
      'byWorkout', (
        SELECT COALESCE(jsonb_agg(jsonb_build_object(
                 'activityType', wt.activity_type,
                 'workoutID',    wt.workout_id,
                 'workoutName',  wd.workout_name,
                 'scheduled',    wt.scheduled,
                 'completed',    wt.completed,
                 'skipped',      wt.skipped,
                 'missed',       wt.missed
               ) ORDER BY (wt.skipped + wt.missed) DESC, wt.scheduled DESC), '[]'::JSONB)
        FROM   workout_totals wt
        LEFT   JOIN get_trends_workout_details(userID) wd
               ON wd.activity_type = wt.activity_type AND wd.workout_id = wt.workout_id
      )
    )
    FROM bounds b;
  $$;
