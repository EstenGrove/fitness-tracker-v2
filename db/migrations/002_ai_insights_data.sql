-- AI insights: per-activity insight data (current vs previous period)
-- - Safe to re-run (CREATE OR REPLACE); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)

  -- STRENGTH
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_strength (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'totalVolume', s.total_volume,
          'maxWeight', s.max_weight,
          'avgDailyVolume', s.avg_daily_volume,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_strength_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'totalVolume', s.total_volume,
          'maxWeight', s.max_weight,
          'avgDailyVolume', s.avg_daily_volume,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_strength_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;

  -- STRETCH
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_stretch (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_stretch_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_stretch_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;

  -- CARDIO 
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_cardio (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_cardio_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_cardio_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;  

  -- WALK
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_walk (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_other_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_other_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;

  -- TIMED
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_timed (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_timed_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_timed_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;

  -- OTHER
  CREATE OR REPLACE FUNCTION get_ai_insights_data_for_other (
      userID UUID,
      startDate DATE DEFAULT (CURRENT_DATE - 30)::DATE,
      endDate DATE DEFAULT CURRENT_DATE
  )
  RETURNS JSONB
  LANGUAGE plpgsql
  AS $$


  DECLARE
      -- Calculate the previous comparable range from our initial/target range
      diffInDays INT := (endDate - startDate)::INT;
      prevStart DATE := (startDate - diffInDays)::DATE;
      prevEnd DATE := startDate;


      currentRange JSONB;
      previousRange JSONB;

  BEGIN
      
      -- CURRENT RANGE
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO currentRange
      FROM get_other_summary_for_range(userID, startDate, endDate) s;

      -- PREVIOUS RANGE (COMPARISON)
      SELECT jsonb_build_object(
          'range', jsonb_build_object(
              'startDate', s.start_date,
              'endDate', s.end_date
          ),
          'totalMins', s.total_mins,
          'totalWorkouts', s.total_workouts,
          'totalDays', s.total_days,
          'totalReps', s.total_reps,
          'avgDailyReps', s.avg_daily_reps,
          'activeDays', s.active_days,
          'activeDayPercent', s.active_day_percentage
      ) INTO previousRange
      FROM get_other_summary_for_range(userID, prevStart, prevEnd) s;


      RETURN jsonb_build_object(
          'current', COALESCE(currentRange, '{}'::JSONB),
          'previous', COALESCE(previousRange, '{}'::JSONB)
      );


  END;
  $$;
