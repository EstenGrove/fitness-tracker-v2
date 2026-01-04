import styles from "../../css/weekly-recap/RecapTitleCard.module.scss";
import RecapCardLayout from "./RecapCardLayout";
import { RangeParams } from "../../features/types";
import { format, isSameMonth } from "date-fns";

type Props = {
	isActive: boolean;
	dateRange: RangeParams;
};

const getRangeDesc = (dateRange: RangeParams) => {
	if (isSameMonth(dateRange.endDate, dateRange.startDate)) {
		const start = format(dateRange.startDate, "MMMM dd");
		const end = format(dateRange.endDate, "dd, yyyy");
		return `${start} - ${end}`;
	} else {
		const start = format(dateRange.startDate, "MMMM dd");
		const end = format(dateRange.endDate, "MMM dd, yyyy");
		return `${start} - ${end}`;
	}
};

const RecapTitleCard = ({ dateRange, isActive = false }: Props) => {
	const range = getRangeDesc(dateRange);
	const header = (
		<>
			<h2 className={styles.Title}>Steven's Weekly Recap</h2>
			<h6 className={styles.Desc}>{range}</h6>
		</>
	);
	// ##TODO:
	// - Add a nice animation here...
	const body = <div></div>;
	if (!isActive) return null;
	return <RecapCardLayout header={header} body={body} />;
};

export default RecapTitleCard;
