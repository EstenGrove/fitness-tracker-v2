-- Shared week helpers used by the AI trend notices (001) & the trends hub (003)
-- - Exported from the local DB, where they were created by hand
-- - Safe to re-run (CREATE OR REPLACE); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)
-- - Depends on: v_workout_history

-- Sunday on/before a date (Postgres' date_trunc('week') is Monday-based)
CREATE OR REPLACE FUNCTION public.week_start_sunday(d date)
 RETURNS date
 LANGUAGE sql
 IMMUTABLE
AS $function$
  SELECT date_trunc('week', d::timestamp + interval '1 day')::date - 1
$function$;

-- Weekly workout totals for the last 'numOfWeeks' COMPLETED weeks (zero-filled), for trend notices
CREATE OR REPLACE FUNCTION public.get_weekly_workout_totals(userid uuid, asofdate date DEFAULT CURRENT_DATE, numofweeks integer DEFAULT 8)
 RETURNS jsonb
 LANGUAGE sql
 STABLE
AS $function$
  WITH bounds AS (
    -- Weeks run Sunday-Saturday. The current (in-progress) week is always excluded.
    SELECT week_start_sunday(asOfDate) - 7            AS last_week_start,   -- most recent COMPLETED week
           week_start_sunday(asOfDate) - 7 * numOfWeeks  AS first_week_start
  ),
  weeks AS (
    -- One row per week, including weeks with no workouts
    SELECT (b.first_week_start + 7 * g)::date AS week_start
    FROM   bounds b, generate_series(0, numOfWeeks - 1) g
  ),
  totals AS (
    SELECT week_start_sunday(h.workout_date) AS week_start,
           SUM(h.duration)              AS total_mins,
           COUNT(*)                          AS total_workouts
    FROM   v_workout_history h, bounds b
    WHERE  h.user_id = userID
      AND  h.workout_date >= b.first_week_start
      AND  h.workout_date <  b.last_week_start + 7
    GROUP  BY 1
  )
  SELECT jsonb_build_object(
    'lastWeekStart',    (SELECT last_week_start FROM bounds),
    'firstWorkoutDate', (SELECT MIN(workout_date)
                         FROM v_workout_history
                         WHERE user_id = userID),
    'weeks', COALESCE(jsonb_agg(
               jsonb_build_object(
                 'weekStart',     w.week_start,
                 'weekEnd',       w.week_start + 6,          -- Saturday, inclusive
                 'totalMins',     COALESCE(t.total_mins, 0),
                 'totalWorkouts', COALESCE(t.total_workouts, 0)
               ) ORDER BY w.week_start
             ), '[]'::jsonb)
  )
  FROM weeks w
  LEFT JOIN totals t USING (week_start);
$function$;
