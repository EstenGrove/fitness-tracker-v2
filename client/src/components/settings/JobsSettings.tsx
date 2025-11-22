import styles from "../../css/settings/JobsSettings.module.scss";
import sprite from "../../assets/icons/calendar.svg";
import { JobsSummary } from "../../features/settings/types";
import { useBackgroundJobsSummary } from "../../hooks/useBackgroundJobsSummary";
import {
	differenceInMilliseconds,
	format,
	formatDistanceToNow,
} from "date-fns";
import { useNavigate } from "react-router";

type BatchSummaryProps = {
	batchSummary: JobsSummary;
};

type BatchCounts = {
	succeeded: number;
	failed: number;
	skipped: number;
	total: number;
};

const getStatusStyles = ({
	succeeded,
	failed,
	skipped,
	total,
}: BatchCounts) => {
	if (succeeded === total) {
		return {
			border: {
				borderLeft: "5px solid var(--accent-green)",
			},
		};
	} else if (failed === total || failed >= total / 2) {
		return {
			border: {
				borderLeft: "5px solid var(--accent-red)",
			},
		};
	} else if (skipped === total || skipped >= total / 2) {
		return {
			border: {
				borderLeft: "5px solid var(--accent-orange)",
			},
		};
	}
};

const BatchSummary = ({ batchSummary }: BatchSummaryProps) => {
	const navigate = useNavigate();
	const { runID, succeeded, failed, skipped, total, startedAt, endedAt } =
		batchSummary;
	const timeOfRun = format(endedAt, "MM/dd/yyyy hh:mm a");
	const toNow = formatDistanceToNow(endedAt);
	const runTime = differenceInMilliseconds(endedAt, startedAt);
	const statusColor = getStatusStyles({ succeeded, failed, skipped, total });

	const goTo = () => {
		navigate(`/settings/jobs/${runID}`);
	};

	return (
		<div className={styles.BatchSummary} style={statusColor?.border}>
			<div className={styles.BatchSummary_header}>
				<div className={styles.BatchSummary_header_top}>
					<h2>Refreshed Workouts </h2>
					<button
						type="button"
						onClick={goTo}
						className={styles.BatchSummary_header_top_btn}
					>
						<svg className={styles.BatchSummary_header_top_btn_icon}>
							<use xlinkHref={`${sprite}#icon-keyboard_arrow_right`}></use>
						</svg>
					</button>
				</div>
				<div>Run Id: {runID}</div>
				<div>
					Completed at {timeOfRun} ({toNow} ago)
				</div>
				<div>Finished in {runTime}ms</div>
			</div>
			<div className={styles.BatchSummary_totals}>
				<div
					className={styles.BatchSummary_totals_success}
					style={{ opacity: succeeded === 0 ? ".4" : "1" }}
				>
					<div>
						{succeeded}/{total}
					</div>
				</div>
				<div
					className={styles.BatchSummary_totals_failed}
					style={{ opacity: failed === 0 ? ".4" : "1" }}
				>
					<div>
						{failed}/{total}
					</div>
				</div>
				<div
					className={styles.BatchSummary_totals_skipped}
					style={{ opacity: skipped === 0 ? ".4" : "1" }}
				>
					<div>
						{skipped}/{total}
					</div>
				</div>
			</div>
		</div>
	);
};

const JobsSettings = () => {
	const { data } = useBackgroundJobsSummary();
	const summaries = data?.summaries as JobsSummary[];

	return (
		<div className={styles.JobsSettings}>
			{summaries &&
				summaries.map((batch, idx) => {
					return (
						<BatchSummary key={`${batch.runID}-${idx}`} batchSummary={batch} />
					);
				})}
		</div>
	);
};

export default JobsSettings;
