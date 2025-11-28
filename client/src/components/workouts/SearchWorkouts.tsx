import styles from "../../css/workouts/SearchWorkouts.module.scss";
import { useAllUserWorkouts } from "../../hooks/useAllUserWorkouts";
import { TodaysWorkout } from "../../features/workouts/types";
import Loader from "../layout/Loader";
import AllWorkouts from "./AllWorkouts";

type Props = {
	onClose: () => void;
};

const SearchWorkouts = ({ onClose }: Props) => {
	const { data, isLoading } = useAllUserWorkouts();
	const allWorkouts = data as TodaysWorkout[];
	const count = allWorkouts?.length ?? 0;
	return (
		<div className={styles.SearchWorkouts}>
			<div className={styles.SearchWorkouts_header}>
				<h2>
					All Workouts <b>({count})</b>{" "}
				</h2>
			</div>
			<div className={styles.SearchWorkouts_main}>
				{isLoading && (
					<div className={styles.SearchWorkouts_main_loader}>
						<Loader>
							<span>Loading workouts...</span>
						</Loader>
					</div>
				)}
				{!isLoading && !!allWorkouts && <AllWorkouts workouts={allWorkouts} />}
			</div>
		</div>
	);
};

export default SearchWorkouts;
