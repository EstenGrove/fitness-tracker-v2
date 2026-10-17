-- AI trend notices: dismissing a notice
-- - Exported from the local DB, where it was created by hand
-- - Safe to re-run (CREATE OR REPLACE); no BEGIN/COMMIT (db/scripts/migrate.sh wraps each file)
-- - Depends on: workout_trend_notices (001)

CREATE OR REPLACE FUNCTION public.dismiss_ai_trend_notice(userid uuid, noticeid uuid, dismissedat timestamp with time zone)
 RETURNS jsonb
 LANGUAGE plpgsql
AS $function$


DECLARE


BEGIN
    UPDATE workout_trend_notices
        SET dismissed_at = dismissedAt
    WHERE user_id = userID AND notice_id = noticeID;

    RETURN jsonb_build_object(
        'userID', userID,
        'noticeID', noticeID,
        'dismissedAt', dismissedAt
    );

END;
$function$;
