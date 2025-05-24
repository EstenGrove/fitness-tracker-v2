import { useSelector } from "react-redux";
import styles from "../css/pages/ActiveWorkoutPage.module.scss";
import { selectCurrentUser } from "../features/user/userSlice";
import { TodaysWorkout } from "../features/workouts/types";
import {
	selectActiveWorkout,
	setActiveWorkout,
} from "../features/workouts/workoutsSlice";
import ActiveWorkout from "../components/active-workout/ActiveWorkout";
import PageContainer from "../components/layout/PageContainer";
import NavArrows from "../components/layout/NavArrows";
import { JsonValue, LocalStorage } from "../utils/utils_storage";
import { useAppDispatch } from "../store/store";
import { useEffect } from "react";
import { addEllipsis } from "../utils/utils_misc";
import { useNavigate } from "react-router";

const ACTIVE_KEY = "ACTIVE";
const storage = new LocalStorage();

const ActiveWorkoutPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const activeWorkout: TodaysWorkout = useSelector(selectActiveWorkout);
	const workoutName: string =
		addEllipsis(activeWorkout?.workoutName, 20) ?? "Active Workout";

	const goBack = () => {
		navigate(-1);
	};

	// Sync active workout upon refresh
	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!activeWorkout) {
			const workout = storage.get(ACTIVE_KEY);
			dispatch(setActiveWorkout(workout as TodaysWorkout));
		} else {
			storage.set(ACTIVE_KEY, activeWorkout as unknown as JsonValue);
		}

		return () => {
			isMounted = false;
		};
	}, [activeWorkout, dispatch]);

	return (
		<PageContainer>
			<div className={styles.ActiveWorkoutPage}>
				<div className={styles.ActiveWorkoutPage_top}>
					<NavArrows onBack={goBack} />
				</div>
				<div className={styles.ActiveWorkoutPage_header}>
					<h2>{workoutName}</h2>
				</div>
				<div className={styles.ActiveWorkoutPage_body}>
					{activeWorkout && (
						<ActiveWorkout
							goBack={goBack}
							currentUser={currentUser}
							workout={activeWorkout}
						/>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default ActiveWorkoutPage;
