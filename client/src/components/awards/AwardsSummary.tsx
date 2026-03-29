import styles from "../../css/awards/AwardsSummary.module.scss";
import { WorkoutAwards, WorkoutAward } from "../../features/awards/types";
import { groupBy, TRecord } from "../../utils/utils_misc";
import AchievementBadge from "../achievements/AchievementBadge";
import AchievementMedal from "../achievements/AchievementMedal";

type Props = {
	awards: WorkoutAwards;
};

type AwardItemProps = {
	label: string;
	value: number | string;
};

const AwardItem = ({ label, value }: AwardItemProps) => {
	return (
		<div className={styles.AwardItem}>
			<AchievementBadge
				title={label}
				label={value.toString()}
				size="SM"
				color="gold"
			/>
		</div>
	);
};

const AwardsSummary = ({ awards }: Props) => {
	const grouped = groupBy("awardCategory", awards.achieved);
	const {
		NTH: nths,
		RECORD: records,
		PATTERN: patterns,
	} = grouped as TRecord<WorkoutAward>;

	console.log({ nths, records, patterns });
	const nthAwardsList = nths.map((award) => (
		<AwardItem
			key={award.awardID}
			label={award.awardName}
			value={award.awardValue}
		/>
	));
	const recordAwardsList = records.map((award) => (
		<AwardItem
			key={award.awardID}
			label={award.awardName}
			value={award.awardValue}
		/>
	));
	const patternAwardsList = patterns.map((award) => (
		<AwardItem
			key={award.awardID}
			label={award.awardName}
			value={award.awardValue}
		/>
	));
	return (
		<div className={styles.AwardsSummary}>
			<div
				style={{ fontSize: "1.6rem", fontWeight: "600", color: "var(--text2)" }}
			>
				Coming Soon...
			</div>
			{/* <div className={styles.AwardsSummary_nth}>{nthAwardsList}</div> */}
			{/* <div className={styles.AwardsSummary_record}>{recordAwardsList}</div>
			<div className={styles.AwardsSummary_pattern}>{patternAwardsList}</div> */}
		</div>
	);
};

export default AwardsSummary;
