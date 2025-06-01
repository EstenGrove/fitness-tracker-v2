import styles from "../../css/details/ViewPostWorkout.module.scss";
import sprite from "../../assets/icons/main.svg";
import { addEllipsis } from "../../utils/utils_misc";
import { useEffect } from "react";
import { TodaysWorkout } from "../../features/workouts/types";
import { PostWorkoutDetails as TPostWorkoutDetails } from "../../features/stats/types";
import { usePostWorkoutDetails } from "../../hooks/usePostWorkoutStats";
import PostWorkoutDetails from "./PostWorkoutDetails";
import TypeBadge from "../activity/TypeBadge";

type Props = {
	workout: TodaysWorkout;
};

const ViewPostWorkout = ({ workout }: Props) => {
	const { workoutID, workoutName, activityType } = workout;
	const name = addEllipsis(workoutName, 25);
	const { data, refetch } = usePostWorkoutDetails(workoutID, activityType);
	const workoutStats = data as TPostWorkoutDetails;

	// always refetch when loading, to purge stale cache
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		refetch();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className={styles.ViewPostWorkout}>
			<div className={styles.ViewPostWorkout_ended}>
				<div className={styles.ViewPostWorkout_ended}>
					<svg className={styles.ViewPostWorkout_ended_icon}>
						<use xlinkHref={`${sprite}#icon-guarantee`}></use>
					</svg>
					<div className={styles.ViewPostWorkout_ended_title}>
						Workout Has Ended!
					</div>
				</div>
			</div>
			<div className={styles.ViewPostWorkout_header}>
				<div className={styles.ViewPostWorkout_header_badge}>
					<TypeBadge activityType={activityType} size="SM" />
				</div>
				<h2 className={styles.ViewPostWorkout_header_title}>{name}</h2>
			</div>
			<div className={styles.ViewPostWorkout_main}>
				{workoutStats?.history && (
					<>
						<PostWorkoutDetails
							entry={workoutStats?.history}
							nthStats={workoutStats?.nthStats}
						/>
					</>
				)}
			</div>
		</div>
	);
};

export default ViewPostWorkout;
