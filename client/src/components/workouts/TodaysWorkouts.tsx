import styles from "../../css/workouts/TodaysWorkouts.module.scss";
import { TodaysWorkout as ITodaysWorkout } from "../../features/workouts/types";
import Loader from "../layout/Loader";
import NoData from "../ui/NoData";
import TodaysWorkout from "./TodaysWorkout";
import { useNavigate } from "react-router";

type Props = { isLoading: boolean; workouts: ITodaysWorkout[] };

const getDoneCount = (workouts: ITodaysWorkout[]) => {
	if (!workouts || !workouts.length) return 0;
	const count =
		workouts.filter((entry) => entry.workoutStatus === "COMPLETE")?.length ?? 0;
	return count;
};

const getTotalCount = (workouts: ITodaysWorkout[]) => {
	if (!workouts || !workouts.length) return 0;
	return workouts.length;
};

const DoneCount = ({ workouts }: { workouts: ITodaysWorkout[] }) => {
	const doneCount = getDoneCount(workouts);
	const totalCount = getTotalCount(workouts);

	return (
		<span className={styles.DoneCount}>
			({doneCount}/{totalCount})
		</span>
	);
};

const TodaysWorkouts = ({ workouts, isLoading }: Props) => {
	const navigate = useNavigate();
	const noWorkouts = !isLoading && (!workouts || !workouts.length);

	const goToAll = () => {
		navigate("all");
	};

	return (
		<div className={styles.TodaysWorkouts}>
			<div className={styles.TodaysWorkouts_heading}>
				<h3 className={styles.TodaysWorkouts_heading_title}>
					<span>Today's Workouts</span>
					<DoneCount workouts={workouts} />
				</h3>
				<div
					className={styles.TodaysWorkouts_heading_showAll}
					onClick={goToAll}
				>
					Show All
				</div>
			</div>
			<div className={styles.TodaysWorkouts_main}>
				{isLoading ? (
					<Loader>
						<span>Loading today...</span>
					</Loader>
				) : (
					<>
						{noWorkouts && <NoData icon="noData" msg="No workouts found." />}
						{workouts &&
							workouts.map((workout) => {
								const key = `${workout.activityType}-${workout.workoutID}`;
								return <TodaysWorkout key={key} workout={workout} />;
							})}
					</>
				)}
			</div>
		</div>
	);
};

export default TodaysWorkouts;
