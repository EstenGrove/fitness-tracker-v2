import styles from "../css/pages/AllWorkoutsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import { useAllUserWorkouts } from "../hooks/useAllUserWorkouts";
import { TodaysWorkout } from "../features/workouts/types";
import AllWorkouts from "../components/workouts/AllWorkouts";

const AllWorkoutsPage = () => {
	const { data, isLoading } = useAllUserWorkouts();
	const allWorkouts = data as TodaysWorkout[];
	const count = allWorkouts?.length ?? 0;

	console.log("allWorkouts", allWorkouts);
	return (
		<PageContainer padding="2rem 2rem">
			<div className={styles.AllWorkoutsPage}>
				<div className={styles.AllWorkoutsPage_header}>
					<h2>
						All Workouts <b>({count})</b>{" "}
					</h2>
				</div>
				<div className={styles.AllWorkoutsPage_main}>
					<AllWorkouts workouts={allWorkouts} />
				</div>
			</div>
		</PageContainer>
	);
};

export default AllWorkoutsPage;
