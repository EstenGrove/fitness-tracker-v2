import { useState } from "react";
import styles from "../../css/weekly-recap/WeeklyRecap.module.scss";
import { WeeklyRecap as IWeeklyRecap } from "../../features/recaps/types";
import { RangeParams } from "../../features/types";
import { useGetWeeklyRecap } from "../../hooks/useGetWeeklyRecap";
import { formatDate } from "../../utils/utils_dates";
import { subDays } from "date-fns";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../../features/user/userSlice";
import TitleCard from "./TitleCard";
import CardIndicators from "./CardIndicators";

type Props = {
	data: IWeeklyRecap;
	dateRange: RangeParams;
};

// FULL PAGE CARDS CAROUSEL

// 1st: User's weekly recap (December 21-27)
// 2nd: # of perfect workout days (eg days where all scheduled workouts were completed) w/ a data viz at the bottom
// 3rd: # of completed workouts in the week with a calendar grid data viz at the bottom
// 4th: Walk card: 'You walked 15.12 miles in 6h 23m'
// 5th: Strength card: 'You did 1h 31m of strength training. You broke your previous workout record!'
// 6th: <activity-type> card
// 7th: Summary card: a summary of the week's workouts & efforts

const defaultRange = {
	startDate: formatDate(subDays(new Date(), 7), "db"),
	endDate: formatDate(new Date(), "db"),
};

const WeeklyRecap = ({ dateRange = defaultRange }: Props) => {
	const currentUser = useSelector(selectCurrentUser);
	const [currentStep, setCurrentStep] = useState<number>(1);
	const { data } = useGetWeeklyRecap(dateRange);

	console.log("data", data);

	const onSelect = (card: number) => {
		console.log("Card IDX:", card);
	};

	return (
		<div className={styles.WeeklyRecap}>
			<CardIndicators total={7} current={currentStep} onSelect={onSelect} />
			<TitleCard usersName={currentUser.firstName} dateRange={dateRange} />
		</div>
	);
};

export default WeeklyRecap;
