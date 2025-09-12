import styles from "../../css/summary/StepsSummary.module.scss";
import { DailySteps, DailyStepsSummary } from "../../features/dashboard/types";
import { isSunday } from "date-fns";
import NoData from "../ui/NoData";
import DetailsCard from "../layout/DetailsCard";
import DailyStepsForWeek from "../dashboard/DailyStepsForWeek";

type Props = {
	stepsSummary: DailyStepsSummary;
};

const getDetailsUrl = (type: string, date: string) => {
	const basePath =
		"/recent?" +
		new URLSearchParams({
			type: type,
			date: date,
		});

	return basePath;
};

const isNewWeek = (data: DailySteps[]) => {
	const now = new Date();
	const hasNoData = data.filter((x) => x?.steps !== 0);
	const isTodaySunday = isSunday(now);

	return isTodaySunday && hasNoData?.length <= 0;
};

const StepsSummary = ({ stepsSummary }: Props) => {
	const isWeekStart: boolean = isNewWeek(stepsSummary);
	return (
		<div className={styles.StepsSummary}>
			<div className={styles.StepsSummary_card}>
				<DetailsCard
					to="/stats/steps"
					title="Daily Steps"
					icon="steps"
					color="var(--accent-orange)"
				>
					{isWeekStart && <NoData icon="noData" />}
					{!isWeekStart && <DailyStepsForWeek recentSteps={stepsSummary} />}
				</DetailsCard>
			</div>
			{/*  */}
		</div>
	);
};

export default StepsSummary;
