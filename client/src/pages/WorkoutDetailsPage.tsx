import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router";
import sprite from "../assets/icons/edit.svg";
import alt from "../assets/icons/calendar.svg";
import styles from "../css/pages/WorkoutDetailsPage.module.scss";
import { Activity } from "../features/shared/types";
import { HistoryOfType } from "../features/history/types";
import { useWorkoutDetails } from "../hooks/useWorkoutDetails";
import { WorkoutByType } from "../features/workouts/types";
import { ACTIVITY_STYLES } from "../utils/utils_activity";
import SearchWorkouts from "../components/workouts/SearchWorkouts";
import WorkoutDetails from "../components/details/WorkoutDetails";
import ModalLG from "../components/shared/ModalLG";
import Loader from "../components/layout/Loader";

type HeaderProps = {
	workout: WorkoutByType;
};

const getTypeColor = (type: Activity) => {
	return ACTIVITY_STYLES[type].color;
};
type ActionType = "EDIT" | "DELETE" | "SEARCH" | "BACK";

type ActionProps = {
	onAction: (action: ActionType) => void;
};

const HeaderActions = ({ onAction }: ActionProps) => {
	return (
		<div className={styles.HeaderActions}>
			<div className={styles.HeaderActions_left}>
				<button
					type="button"
					onClick={() => onAction("BACK")}
					className={styles.HeaderActions_back}
				>
					<svg className={styles.HeaderActions_back_icon}>
						<use xlinkHref={`${alt}#icon-arrow_left`}></use>
					</svg>
					<span>Back</span>
				</button>
			</div>
			<div className={styles.HeaderActions_right}>
				<button
					type="button"
					onClick={() => onAction("SEARCH")}
					className={styles.HeaderActions_search}
				>
					<svg className={styles.HeaderActions_search_icon}>
						<use xlinkHref={`${alt}#icon-search`}></use>
					</svg>
				</button>
				<button
					type="button"
					onClick={() => onAction("EDIT")}
					className={styles.HeaderActions_edit}
				>
					<svg className={styles.HeaderActions_edit_icon}>
						<use xlinkHref={`${sprite}#icon-edit-3`}></use>
					</svg>
				</button>
				<button
					type="button"
					onClick={() => onAction("DELETE")}
					className={styles.HeaderActions_delete}
				>
					<svg className={styles.HeaderActions_delete_icon}>
						<use xlinkHref={`${sprite}#icon-delete_outline`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};

const Header = ({ workout }: HeaderProps) => {
	const type = workout.activityType;
	const typeColor = { color: getTypeColor(type) };
	return (
		<header className={styles.Header}>
			<div className={styles.Header_type} style={typeColor}>
				{type} Exercise
			</div>
			<h2 className={styles.Header_name}>{workout.workoutName}</h2>
			<div className={styles.Header_desc}>{workout.workoutDesc}</div>
		</header>
	);
};

const WorkoutDetailsPage = () => {
	const { id } = useParams();
	const [params] = useSearchParams();
	const navigate = useNavigate();
	const activityType = params.get("type") as Activity;
	const { data, isLoading } = useWorkoutDetails({
		workoutID: Number(id),
		activityType: activityType,
	});
	const workout = data?.workout as WorkoutByType;
	const schedule = data?.schedule ?? null;
	const history = data?.history as HistoryOfType[];
	const hasDetails = data && data?.workout && !isLoading;
	const [showSearchModal, setShowSearchModal] = useState<boolean>(false);

	const openSearchModal = () => {
		setShowSearchModal(true);
	};
	const closeSearchModal = () => {
		setShowSearchModal(false);
	};

	const onAction = (action: ActionType) => {
		switch (action) {
			case "EDIT": {
				return;
			}
			case "DELETE": {
				return;
			}
			case "SEARCH": {
				openSearchModal();
				return;
			}
			case "BACK": {
				return navigate(-1);
			}
			default:
				break;
		}
	};

	return (
		<div className={styles.WorkoutDetailsPage}>
			{isLoading && (
				<div className={styles.WorkoutDetailsPage_loader}>
					<Loader />
					<span>Loading...</span>
				</div>
			)}
			<HeaderActions onAction={onAction} />
			{hasDetails && <Header workout={workout} />}

			<div className={styles.WorkoutDetailsPage_main}>
				{hasDetails && (
					<WorkoutDetails
						workout={workout}
						schedule={schedule}
						history={history}
					/>
				)}
			</div>

			{showSearchModal && (
				<ModalLG onClose={closeSearchModal}>
					<SearchWorkouts onClose={closeSearchModal} />
				</ModalLG>
			)}
		</div>
	);
};

export default WorkoutDetailsPage;
