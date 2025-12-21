import styles from "../../css/workouts/CompletedTodayWorkouts.module.scss";
import {
	EWorkoutStatus,
	TodaysWorkout as ITodaysWorkout,
} from "../../features/workouts/types";
import { getWorkoutsByStatus } from "../../utils/utils_workouts";
import Loader from "../layout/Loader";
import FadeSlideIn from "../ui/FadeSlideIn";
import NoData from "../ui/NoData";
import TodaysWorkout from "./TodaysWorkout";
import { useNavigate } from "react-router";

type Props = {
	title?: string;
	isLoading: boolean;
	workouts: ITodaysWorkout[];
};

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

interface CountParams {
	workouts: ITodaysWorkout[];
	skippedWorkouts: ITodaysWorkout[];
}

const getCountStyles = (params: CountParams) => {
	const { workouts, skippedWorkouts } = params;
	const done = getDoneCount(workouts);
	const skipped = skippedWorkouts?.length ?? 0;

	return {
		done: {
			color: done > 0 ? "var(--accent-green)" : "var(--text2)",
		},
		total: {
			color: "var(--text2)",
		},
		skipped: {
			color: skipped > 0 ? "var(--accent-red)" : "var(--text2)",
		},
	};
};

type PillTotalProps = {
	color?: string;
	total: number;
	label: string;
};
const PillTotal = ({ total, color, label }: PillTotalProps) => {
	const css = { backgroundColor: color };
	return (
		<div className={styles.PillTotal} style={css} tabIndex={0}>
			<div className={styles.PillText}>{total}</div>
			<span className={styles.PillLabel}>{label}</span>
		</div>
	);
};

const pillOpts = {
	usePills: false,
	useFaded: true,
};

const Totals = ({
	workouts = [],
	skippedWorkouts = [],
}: {
	workouts: ITodaysWorkout[];
	skippedWorkouts: ITodaysWorkout[];
}) => {
	const usePills = pillOpts.usePills;
	const done = getDoneCount(workouts);
	const total = getTotalCount(workouts);
	const skipped = skippedWorkouts?.length ?? 0;
	const countStyles = getCountStyles({ workouts, skippedWorkouts });

	if (usePills) {
		return (
			<div className={styles.Pills}>
				{pillOpts.useFaded ? (
					<>
						<PillTotal label="Done" total={done} color="var(--fadedGreen)" />
						<PillTotal
							label="Skipped"
							total={skipped}
							color="var(--fadedRed)"
						/>
						<PillTotal label="Total" total={total} />
					</>
				) : (
					<>
						<PillTotal label="Done" total={done} color="var(--greenBG)" />
						<PillTotal label="Skipped" total={skipped} color="var(--redBG)" />
						<PillTotal label="Total" total={total} />
					</>
				)}
			</div>
		);
	}
	return (
		<div className={styles.Counts}>
			(
			<span id="done" style={countStyles.done} title={`${done} completed`}>
				{done}
			</span>
			<span>|</span>
			<span id="total" style={countStyles.total} title={`${total} total`}>
				{total}
			</span>
			)
			{skipped > 0 && (
				<>
					({" "}
					<span id="skipped" style={countStyles.skipped}>
						{skipped}
					</span>
					)
				</>
			)}
		</div>
	);
};

const getSkippedWorkouts = (workouts: ITodaysWorkout[]) => {
	const skipped = getWorkoutsByStatus(EWorkoutStatus.SKIPPED, workouts);

	return skipped;
};

const CompletedTodayWorkouts = ({
	title = "Unscheduled Workouts",
	workouts = [],
	isLoading,
}: Props) => {
	const navigate = useNavigate();
	const noWorkouts = !isLoading && (!workouts || !workouts.length);
	const skipped = getSkippedWorkouts(workouts);

	const goToAll = () => {
		navigate("all");
	};

	return (
		<div className={styles.CompletedTodayWorkouts}>
			<div className={styles.CompletedTodayWorkouts_heading}>
				<h3 className={styles.CompletedTodayWorkouts_heading_title}>
					<span>{title}</span>
					<Totals workouts={workouts} skippedWorkouts={skipped} />
				</h3>
				<div
					className={styles.CompletedTodayWorkouts_heading_showAll}
					onClick={goToAll}
				></div>
			</div>
			<div className={styles.CompletedTodayWorkouts_main}>
				{isLoading ? (
					<Loader>
						<span>Loading today...</span>
					</Loader>
				) : (
					<>
						{noWorkouts && <NoData icon="noData" msg="No workouts found." />}
						{workouts &&
							workouts.map((workout, idx) => {
								const delay = idx * 200;
								const key = `${workout.activityType}-${workout.workoutID}`;
								return (
									<FadeSlideIn duration={delay} key={key + idx}>
										<TodaysWorkout key={key} workout={workout} />
									</FadeSlideIn>
								);
							})}
					</>
				)}
			</div>
		</div>
	);
};

export default CompletedTodayWorkouts;
