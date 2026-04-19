import styles from "../../css/awards/AwardsSummary.module.scss";
import { WorkoutAwards, WorkoutAward } from "../../features/awards/types";
import { getAchievementDisplayTier } from "../../utils/utils_achievements";
import { groupBy, TRecord } from "../../utils/utils_misc";
import AchievementAward from "../achievements/AchievementAward";

type Props = {
	awards: WorkoutAwards;
};

type AwardItemProps = {
	award: WorkoutAward;
};

const AwardItem = ({ award }: AwardItemProps) => {
	const { color, variant } = getAchievementDisplayTier(award);
	const { awardName, awardMetric, awardThreshold, awardValue, wasAchieved } =
		award;
	return (
		<div className={styles.AwardItem}>
			<div className={styles.AwardItem_award}>
				<AchievementAward
					title={awardThreshold.toString()}
					label={awardMetric.toLowerCase()}
					shape="circle"
					color={color}
					variant={variant}
					hasAchieved={wasAchieved}
				/>
			</div>
			<div className={styles.AwardItem_details}>
				<div className={styles.AwardItem_details_label}>{awardName}</div>
				<div className={styles.AwardItem_details_streak}>
					<b>{awardValue}</b> {awardMetric}
				</div>
			</div>
		</div>
	);
};

const getAwardsListPreview = (awards: WorkoutAward[]) => {
	if (!awards || !awards.length) return [];
	const grouped = groupBy("awardCategory", awards);
	const { NTH: nths, PATTERN: patterns } = grouped as TRecord<WorkoutAward>;
	const awardsList = [nths?.[0], patterns?.[0]];
	return awardsList;
};

const AwardsSummary = ({ awards }: Props) => {
	const awardsList = getAwardsListPreview(awards.achieved);

	return (
		<div className={styles.AwardsSummary}>
			{awardsList.map((award) => {
				const { awardCategory, awardID } = award;
				const key = `${awardCategory}-${awardID}`;
				return <AwardItem key={key} award={award} />;
			})}
		</div>
	);
};

export default AwardsSummary;
