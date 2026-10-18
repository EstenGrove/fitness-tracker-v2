-- Trends Hub (/trends): Phase 2 categories (strength, effort, cardio & walking)
-- - Same conventions as 003: whole COMPLETED Sunday-Saturday weeks, current period + the equal-length
--   prior period, '(userID, asOfDate, numOfWeeks)' signature, camelCase JSON keys
-- - Set lines: each element of a history row's 'sets' JSON is ONE set. Its 'sets' field is ignored
--   (cardio repeats the workout's set count on every line), matching get_cardio_summary_for_day/month.
-- - Depends on: week_start_sunday() (000), get_trend_period_bounds() & get_trends_workout_details() (003),
--   v_workout_history, get_workout_calories()
-- - Safe to re-run (CREATE OR REPLACE); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)


-- HELPERS

-- Text -> numeric, or 'fallback' when it isn't a plain number (reps are stored as text or numbers)
CREATE OR REPLACE FUNCTION to_numeric_or (
    value TEXT,
    fallback NUMERIC
)
RETURNS NUMERIC
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE WHEN value ~ '^-?[0-9]+(\.[0-9]+)?$' THEN value::NUMERIC ELSE fallback END;
$$;

-- Effort level -> 1 (Easy) .. 5 (All Out); NULL for 'None' (not logged)
CREATE OR REPLACE FUNCTION effort_score (
    effort effort_level
)
RETURNS INT
LANGUAGE sql
IMMUTABLE
AS $$
  SELECT CASE effort
    WHEN 'Easy'      THEN 1
    WHEN 'Moderate'  THEN 2
    WHEN 'Hard'      THEN 3
    WHEN 'Strenuous' THEN 4
    WHEN 'All Out'   THEN 5
  END;
$$;


-- STRENGTH
-- Load: volume (weight x reps), sessions, best set (estimated 1-rep max) & PR baselines.
-- - Estimated 1-rep max (Epley) = weight x (1 + reps / 30); only sets with weight & reps count
-- - 'previousBestE1rm' = a workout's best from ALL history before the current period (for PRs)
CREATE OR REPLACE FUNCTION get_trends_strength (
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
    -- Every session up to the period's end (all history: PR baselines need it), tagged by period
    SELECT h.history_id,
           h.workout_id,
           h.workout_date,
           h.sets,
           CASE WHEN h.workout_date >= b.first_week_start       THEN 'current'
                WHEN h.workout_date >= b.prior_first_week_start THEN 'prior'
                ELSE 'before' END AS period
    FROM   strength_history h, bounds b
    WHERE  h.user_id = userID
      AND  h.workout_date < b.last_week_start + 7
  ),
  set_lines AS MATERIALIZED (
    SELECT h.history_id,
           to_numeric_or(s->>'weight', 0) AS weight,
           to_numeric_or(s->>'reps', 0)   AS reps
    FROM   history h
    CROSS  JOIN LATERAL jsonb_array_elements(
             CASE WHEN jsonb_typeof(h.sets) = 'array' THEN h.sets ELSE '[]'::JSONB END
           ) AS s
  ),
  session_volume AS (
    SELECT history_id, SUM(weight * reps) AS volume
    FROM   set_lines
    GROUP  BY 1
  ),
  session_best AS (
    -- Each session's best set by estimated 1-rep max
    SELECT DISTINCT ON (history_id)
           history_id, weight, reps, weight * (1 + reps / 30.0) AS e1rm
    FROM   set_lines
    WHERE  weight > 0 AND reps > 0
    ORDER  BY history_id, weight * (1 + reps / 30.0) DESC
  ),
  sessions AS MATERIALIZED (
    SELECT h.history_id,
           h.workout_id,
           h.workout_date,
           h.period,
           COALESCE(v.volume, 0) AS volume,
           sb.weight AS best_weight,
           sb.reps   AS best_reps,
           sb.e1rm   AS best_e1rm
    FROM   history h
    LEFT   JOIN session_volume v USING (history_id)
    LEFT   JOIN session_best sb  USING (history_id)
  ),
  period_totals AS (
    SELECT p.period,
           COUNT(s.history_id)            AS sessions,
           COALESCE(SUM(s.volume), 0)     AS volume,
           MAX(s.best_e1rm)               AS best_e1rm
    FROM   (VALUES ('current'), ('prior')) AS p(period)
    LEFT   JOIN sessions s ON s.period = p.period
    GROUP  BY p.period
  ),
  weeks AS (
    SELECT (b.first_week_start + 7 * g)::DATE AS week_start
    FROM   bounds b, generate_series(0, numOfWeeks - 1) g
  ),
  week_totals AS (
    SELECT week_start_sunday(workout_date) AS week_start,
           SUM(volume)                     AS volume,
           COUNT(*)                        AS sessions
    FROM   sessions
    WHERE  period = 'current'
    GROUP  BY 1
  ),
  week_workout_totals AS (
    -- Sparse (non-zero only), for the stacked chart
    SELECT week_start_sunday(workout_date) AS week_start,
           workout_id,
           SUM(volume)                     AS volume
    FROM   sessions
    WHERE  period = 'current' AND volume > 0
    GROUP  BY 1, 2
  ),
  workout_totals AS (
    SELECT workout_id,
           COUNT(*) FILTER (WHERE period = 'current')                   AS current_sessions,
           COALESCE(SUM(volume) FILTER (WHERE period = 'current'), 0)   AS current_volume,
           COUNT(*) FILTER (WHERE period = 'prior')                     AS prior_sessions,
           COALESCE(SUM(volume) FILTER (WHERE period = 'prior'), 0)     AS prior_volume,
           MAX(best_e1rm) FILTER (WHERE period IN ('prior', 'before'))  AS previous_best_e1rm,
           MAX(workout_date) FILTER (WHERE period = 'current')          AS last_session_date
    FROM   sessions
    GROUP  BY 1
  ),
  workout_best AS (
    -- The session that FIRST reached each workout's best set in the current period
    SELECT DISTINCT ON (workout_id)
           workout_id, workout_date AS best_date, best_weight, best_reps, best_e1rm
    FROM   sessions
    WHERE  period = 'current' AND best_e1rm IS NOT NULL
    ORDER  BY workout_id, best_e1rm DESC, workout_date ASC
  ),
  workout_rows AS (
    SELECT wt.*,
           wb.best_date, wb.best_weight, wb.best_reps, wb.best_e1rm,
           (SELECT COUNT(*) FROM sessions s
             WHERE s.workout_id = wt.workout_id AND s.period = 'current'
               AND s.workout_date > wb.best_date)                   AS sessions_since_best,
           wd.workout_name
    FROM   workout_totals wt
    LEFT   JOIN workout_best wb USING (workout_id)
    LEFT   JOIN get_trends_workout_details(userID) wd
           ON wd.activity_type = 'Strength' AND wd.workout_id = wt.workout_id
    WHERE  wt.current_sessions > 0 OR wt.prior_sessions > 0
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
    'firstWorkoutDate', (SELECT MIN(workout_date) FROM strength_history WHERE user_id = userID),
    'current', (
      SELECT jsonb_build_object(
        'sessions',  t.sessions,
        'volume',    ROUND(t.volume, 1),
        'bestE1rm',  ROUND(t.best_e1rm, 1)
      ) FROM period_totals t WHERE t.period = 'current'
    ),
    'prior', (
      SELECT jsonb_build_object(
        'sessions',  t.sessions,
        'volume',    ROUND(t.volume, 1),
        'bestE1rm',  ROUND(t.best_e1rm, 1)
      ) FROM period_totals t WHERE t.period = 'prior'
    ),
    'weeks', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'weekStart', w.week_start,
               'volume',    ROUND(COALESCE(wt.volume, 0), 1),
               'sessions',  COALESCE(wt.sessions, 0)
             ) ORDER BY w.week_start), '[]'::JSONB)
      FROM   weeks w
      LEFT   JOIN week_totals wt USING (week_start)
    ),
    'weeksByWorkout', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'weekStart', ww.week_start,
               'workoutID', ww.workout_id,
               'volume',    ROUND(ww.volume, 1)
             ) ORDER BY ww.week_start, ww.workout_id), '[]'::JSONB)
      FROM   week_workout_totals ww
    ),
    'byWorkout', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'workoutID',         r.workout_id,
               'workoutName',       r.workout_name,
               'currentSessions',   r.current_sessions,
               'currentVolume',     ROUND(r.current_volume, 1),
               'priorSessions',     r.prior_sessions,
               'priorVolume',       ROUND(r.prior_volume, 1),
               'bestE1rm',          ROUND(r.best_e1rm, 1),
               'bestWeight',        r.best_weight,
               'bestReps',          r.best_reps,
               'bestDate',          r.best_date,
               'previousBestE1rm',  ROUND(r.previous_best_e1rm, 1),
               'sessionsSinceBest', COALESCE(r.sessions_since_best, 0),
               'lastSessionDate',   r.last_session_date
             ) ORDER BY r.current_volume DESC, r.prior_volume DESC), '[]'::JSONB)
      FROM   workout_rows r
    )
  )
  FROM bounds b;
$$;


-- EFFORT
-- Intensity: effort mix, average effort (1-5), hard days & estimated calories.
-- - 'Hard+' = Hard, Strenuous or All Out (score >= 3); sessions with effort 'None' are 'unrated'
-- - Calories are ESTIMATED by get_workout_calories() (duration x effort x activity)
CREATE OR REPLACE FUNCTION get_trends_effort (
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
  sessions AS MATERIALIZED (
    SELECT h.history_id,
           h.activity_type,
           h.workout_date,
           h.duration AS mins,
           effort_score(h.effort) AS score,
           COALESCE(get_workout_calories(userID, h.history_id, h.activity_type, h.effort), 0) AS calories,
           CASE WHEN h.workout_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period
    FROM   v_workout_history h, bounds b
    WHERE  h.user_id = userID
      AND  h.workout_date >= b.prior_first_week_start
      AND  h.workout_date <  b.last_week_start + 7
  ),
  hard_days AS (
    SELECT DISTINCT period, workout_date FROM sessions WHERE score >= 3
  ),
  period_totals AS (
    SELECT p.period,
           COUNT(s.history_id)                        AS sessions,
           COUNT(s.score)                             AS rated_sessions,
           COUNT(*) FILTER (WHERE s.score >= 3)       AS hard_sessions,
           AVG(s.score)                               AS avg_score,
           COALESCE(SUM(s.calories), 0)               AS calories,
           COALESCE(SUM(s.mins), 0)                   AS total_mins,
           (SELECT COUNT(*) FROM hard_days hd WHERE hd.period = p.period) AS hard_days,
           -- Hard days whose previous day was also hard (eg. 3 in a row = 2)
           (SELECT COUNT(*) FROM hard_days hd
             WHERE hd.period = p.period
               AND EXISTS (SELECT 1 FROM hard_days prev
                            WHERE prev.period = hd.period
                              AND prev.workout_date = hd.workout_date - 1)) AS back_to_back_hard_days
    FROM   (VALUES ('current'), ('prior')) AS p(period)
    LEFT   JOIN sessions s ON s.period = p.period
    GROUP  BY p.period
  ),
  weeks AS (
    SELECT (b.first_week_start + 7 * g)::DATE AS week_start
    FROM   bounds b, generate_series(0, numOfWeeks - 1) g
  ),
  week_totals AS (
    SELECT week_start_sunday(workout_date)          AS week_start,
           COUNT(*) FILTER (WHERE score = 1)        AS easy,
           COUNT(*) FILTER (WHERE score = 2)        AS moderate,
           COUNT(*) FILTER (WHERE score = 3)        AS hard,
           COUNT(*) FILTER (WHERE score = 4)        AS strenuous,
           COUNT(*) FILTER (WHERE score = 5)        AS all_out,
           COUNT(*) FILTER (WHERE score IS NULL)    AS unrated,
           SUM(calories)                            AS calories
    FROM   sessions
    WHERE  period = 'current'
    GROUP  BY 1
  ),
  activity_totals AS (
    SELECT activity_type,
           COUNT(*) FILTER (WHERE period = 'current')        AS current_sessions,
           AVG(score) FILTER (WHERE period = 'current')      AS current_avg_score,
           AVG(score) FILTER (WHERE period = 'prior')        AS prior_avg_score
    FROM   sessions
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
        'sessions',            t.sessions,
        'ratedSessions',       t.rated_sessions,
        'hardSessions',        t.hard_sessions,
        'avgScore',            ROUND(t.avg_score, 2),
        'hardDays',            t.hard_days,
        'backToBackHardDays',  t.back_to_back_hard_days,
        'calories',            ROUND(t.calories),
        'totalMins',           ROUND(t.total_mins, 1)
      ) FROM period_totals t WHERE t.period = 'current'
    ),
    'prior', (
      SELECT jsonb_build_object(
        'sessions',            t.sessions,
        'ratedSessions',       t.rated_sessions,
        'hardSessions',        t.hard_sessions,
        'avgScore',            ROUND(t.avg_score, 2),
        'hardDays',            t.hard_days,
        'backToBackHardDays',  t.back_to_back_hard_days,
        'calories',            ROUND(t.calories),
        'totalMins',           ROUND(t.total_mins, 1)
      ) FROM period_totals t WHERE t.period = 'prior'
    ),
    'weeks', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'weekStart', w.week_start,
               'easy',      COALESCE(wt.easy, 0),
               'moderate',  COALESCE(wt.moderate, 0),
               'hard',      COALESCE(wt.hard, 0),
               'strenuous', COALESCE(wt.strenuous, 0),
               'allOut',    COALESCE(wt.all_out, 0),
               'unrated',   COALESCE(wt.unrated, 0),
               'calories',  ROUND(COALESCE(wt.calories, 0))
             ) ORDER BY w.week_start), '[]'::JSONB)
      FROM   weeks w
      LEFT   JOIN week_totals wt USING (week_start)
    ),
    'byActivity', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'activityType',    a.activity_type,
               'currentSessions', a.current_sessions,
               'currentAvgScore', ROUND(a.current_avg_score, 2),
               'priorAvgScore',   ROUND(a.prior_avg_score, 2)
             ) ORDER BY a.current_sessions DESC), '[]'::JSONB)
      FROM   activity_totals a
    )
  )
  FROM bounds b;
$$;


-- CARDIO & WALKING
-- Cardio = bodyweight reps (cardio_history set lines); walking = distance, steps & pace (walk_history).
-- - Pace = total walk minutes / total miles (min per mile), so long walks weigh more than short ones
CREATE OR REPLACE FUNCTION get_trends_cardio_walking (
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
  cardio AS MATERIALIZED (
    SELECT h.history_id,
           h.workout_id,
           h.workout_date,
           (SELECT COALESCE(SUM(to_numeric_or(s->>'reps', 0)), 0)
              FROM jsonb_array_elements(
                     CASE WHEN jsonb_typeof(h.sets) = 'array' THEN h.sets ELSE '[]'::JSONB END
                   ) AS s) AS reps,
           CASE WHEN h.workout_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period
    FROM   cardio_history h, bounds b
    WHERE  h.user_id = userID
      AND  h.workout_date >= b.prior_first_week_start
      AND  h.workout_date <  b.last_week_start + 7
  ),
  walks AS MATERIALIZED (
    SELECT h.history_id,
           h.workout_id,
           h.workout_date,
           COALESCE(h.miles, 0)    AS miles,
           COALESCE(h.steps, 0)    AS steps,
           COALESCE(h.duration, 0) AS mins,
           CASE WHEN h.workout_date >= b.first_week_start THEN 'current' ELSE 'prior' END AS period
    FROM   walk_history h, bounds b
    WHERE  h.user_id = userID
      AND  h.workout_date >= b.prior_first_week_start
      AND  h.workout_date <  b.last_week_start + 7
  ),
  cardio_totals AS (
    SELECT p.period,
           COUNT(c.history_id)         AS sessions,
           COALESCE(SUM(c.reps), 0)    AS reps,
           MAX(c.reps)                 AS best_session_reps
    FROM   (VALUES ('current'), ('prior')) AS p(period)
    LEFT   JOIN cardio c ON c.period = p.period
    GROUP  BY p.period
  ),
  walk_totals AS (
    SELECT p.period,
           COUNT(w.history_id)         AS walks,
           COALESCE(SUM(w.miles), 0)   AS miles,
           COALESCE(SUM(w.steps), 0)   AS steps,
           COALESCE(SUM(w.mins), 0)    AS mins,
           -- min/mile, only from walks that logged a distance
           SUM(w.mins) FILTER (WHERE w.miles > 0) / NULLIF(SUM(w.miles) FILTER (WHERE w.miles > 0), 0) AS pace
    FROM   (VALUES ('current'), ('prior')) AS p(period)
    LEFT   JOIN walks w ON w.period = p.period
    GROUP  BY p.period
  ),
  weeks AS (
    SELECT (b.first_week_start + 7 * g)::DATE AS week_start
    FROM   bounds b, generate_series(0, numOfWeeks - 1) g
  ),
  cardio_weeks AS (
    SELECT week_start_sunday(workout_date) AS week_start, SUM(reps) AS reps, COUNT(*) AS sessions
    FROM   cardio WHERE period = 'current' GROUP BY 1
  ),
  walk_weeks AS (
    SELECT week_start_sunday(workout_date) AS week_start, SUM(miles) AS miles, SUM(steps) AS steps, COUNT(*) AS walks
    FROM   walks WHERE period = 'current' GROUP BY 1
  ),
  cardio_by_workout AS (
    SELECT c.workout_id,
           wd.workout_name,
           COUNT(*) FILTER (WHERE c.period = 'current')                  AS current_sessions,
           COALESCE(SUM(c.reps) FILTER (WHERE c.period = 'current'), 0)  AS current_reps,
           COALESCE(SUM(c.reps) FILTER (WHERE c.period = 'prior'), 0)    AS prior_reps
    FROM   cardio c
    LEFT   JOIN get_trends_workout_details(userID) wd
           ON wd.activity_type = 'Cardio' AND wd.workout_id = c.workout_id
    GROUP  BY 1, 2
  ),
  walk_by_workout AS (
    SELECT w.workout_id,
           wd.workout_name,
           COUNT(*) FILTER (WHERE w.period = 'current')                   AS current_walks,
           COALESCE(SUM(w.miles) FILTER (WHERE w.period = 'current'), 0)  AS current_miles,
           COALESCE(SUM(w.miles) FILTER (WHERE w.period = 'prior'), 0)    AS prior_miles
    FROM   walks w
    LEFT   JOIN get_trends_workout_details(userID) wd
           ON wd.activity_type = 'Walk' AND wd.workout_id = w.workout_id
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
    'firstCardioDate', (SELECT MIN(workout_date) FROM cardio_history WHERE user_id = userID),
    'firstWalkDate',   (SELECT MIN(workout_date) FROM walk_history WHERE user_id = userID),
    'cardio', jsonb_build_object(
      'current', (SELECT jsonb_build_object('sessions', t.sessions, 'reps', t.reps, 'bestSessionReps', t.best_session_reps)
                    FROM cardio_totals t WHERE t.period = 'current'),
      'prior',   (SELECT jsonb_build_object('sessions', t.sessions, 'reps', t.reps, 'bestSessionReps', t.best_session_reps)
                    FROM cardio_totals t WHERE t.period = 'prior'),
      -- The current period's biggest session (ties: the latest)
      'bestSession', (SELECT jsonb_build_object('date', c.workout_date, 'reps', c.reps, 'workoutName', wd.workout_name)
                        FROM cardio c
                        LEFT JOIN get_trends_workout_details(userID) wd
                             ON wd.activity_type = 'Cardio' AND wd.workout_id = c.workout_id
                       WHERE c.period = 'current' AND c.reps > 0
                       ORDER BY c.reps DESC, c.workout_date DESC LIMIT 1),
      'byWorkout', (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                      'workoutID',       cw.workout_id,
                      'workoutName',     cw.workout_name,
                      'currentSessions', cw.current_sessions,
                      'currentReps',     cw.current_reps,
                      'priorReps',       cw.prior_reps
                    ) ORDER BY cw.current_reps DESC, cw.prior_reps DESC), '[]'::JSONB)
                    FROM cardio_by_workout cw)
    ),
    'walking', jsonb_build_object(
      'current', (SELECT jsonb_build_object('walks', t.walks, 'miles', ROUND(t.miles, 2), 'steps', t.steps,
                                            'mins', ROUND(t.mins, 1), 'pace', ROUND(t.pace, 2))
                    FROM walk_totals t WHERE t.period = 'current'),
      'prior',   (SELECT jsonb_build_object('walks', t.walks, 'miles', ROUND(t.miles, 2), 'steps', t.steps,
                                            'mins', ROUND(t.mins, 1), 'pace', ROUND(t.pace, 2))
                    FROM walk_totals t WHERE t.period = 'prior'),
      -- The current period's longest walk (ties: the latest)
      'longestWalk', (SELECT jsonb_build_object('date', w.workout_date, 'miles', ROUND(w.miles, 2), 'workoutName', wd.workout_name)
                        FROM walks w
                        LEFT JOIN get_trends_workout_details(userID) wd
                             ON wd.activity_type = 'Walk' AND wd.workout_id = w.workout_id
                       WHERE w.period = 'current' AND w.miles > 0
                       ORDER BY w.miles DESC, w.workout_date DESC LIMIT 1),
      'byWorkout', (SELECT COALESCE(jsonb_agg(jsonb_build_object(
                      'workoutID',     ww.workout_id,
                      'workoutName',   ww.workout_name,
                      'currentWalks',  ww.current_walks,
                      'currentMiles',  ROUND(ww.current_miles, 2),
                      'priorMiles',    ROUND(ww.prior_miles, 2)
                    ) ORDER BY ww.current_miles DESC, ww.prior_miles DESC), '[]'::JSONB)
                    FROM walk_by_workout ww)
    ),
    'weeks', (
      SELECT COALESCE(jsonb_agg(jsonb_build_object(
               'weekStart',      w.week_start,
               'cardioReps',     COALESCE(cw.reps, 0),
               'cardioSessions', COALESCE(cw.sessions, 0),
               'walkMiles',      ROUND(COALESCE(ww.miles, 0), 2),
               'walkSteps',      COALESCE(ww.steps, 0),
               'walks',          COALESCE(ww.walks, 0)
             ) ORDER BY w.week_start), '[]'::JSONB)
      FROM   weeks w
      LEFT   JOIN cardio_weeks cw USING (week_start)
      LEFT   JOIN walk_weeks ww   USING (week_start)
    )
  )
  FROM bounds b;
$$;
