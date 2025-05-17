import { useState } from "react";
import sprite from "../../assets/icons/habits.svg";
import sprite2 from "../../assets/icons/main.svg";
import styles from "../../css/habits/HabitCard.module.scss";
import { HabitCardInfo } from "../../features/habits/types";
import { habitIcons } from "../../utils/utils_habits";
import { addEllipsis } from "../../utils/utils_misc";
import { formatDate } from "../../utils/utils_dates";
import { useNavigate } from "react-router";
import MenuDropdown from "../shared/MenuDropdown";

type Props = {
	habit: HabitCardInfo;
};

type TotalProps = {
	loggedValue: number;
	targetValue: number;
	unit: string;
};

// type HabitStatus = 'On Track' | 'Exceeded Target' | 'Needs Reduction' | 'Over Target' | 'Eliminated' | 'Still Occurring' | 'Lapsed' | 'Maintained'

const Total = ({ loggedValue = 0, targetValue = 0, unit }: TotalProps) => {
	const habitUnit = addEllipsis(unit, 10);
	return (
		<div className={styles.Total}>
			<span className={styles.Total_logged}>{loggedValue}</span>
			<span className={styles.Total_slash}>/</span>
			<span className={styles.Total_target}>
				{targetValue} {habitUnit}
			</span>
		</div>
	);
};

type HeaderProps = {
	icon: string;
	color: string;
	name: string;
	goTo: () => void;
};

const HabitHeader = ({
	icon,
	name,
	color = "var(--text1_5",
	goTo,
}: HeaderProps) => {
	const css = { fill: color };
	const habitName = addEllipsis(name, 18);
	const [showMore, setShowMore] = useState<boolean>(false);

	const openMore = () => setShowMore(true);
	const closeMore = () => setShowMore(false);

	return (
		<div className={styles.HabitHeader}>
			<svg className={styles.HabitHeader_icon} style={css} onClick={goTo}>
				<use xlinkHref={`${sprite}#icon-${icon}`}></use>
			</svg>
			<h3 className={styles.HabitHeader_title} onClick={goTo}>
				{habitName}
			</h3>
			<svg className={styles.HabitHeader_more} onClick={openMore}>
				<use xlinkHref={`${sprite2}#icon-dots-three-vertical`}></use>
			</svg>

			{showMore && (
				<MenuDropdown closeMenu={closeMore}>
					<li className={styles.MenuItem}>View</li>
					<li className={styles.MenuItem}>Change Goal</li>
					<li className={styles.MenuItem}>Delete</li>
				</MenuDropdown>
			)}
		</div>
	);
};

type AboutProps = {
	habit: HabitCardInfo;
};

const getDates = (startDate: string) => {
	const start = formatDate(startDate, "short");

	return `Started ${start}`;
};

const About = ({ habit }: AboutProps) => {
	const { startDate, maxStreak = "3 days" } = habit;
	const dateDesc = getDates(startDate);

	return (
		<div className={styles.About}>
			<div className={styles.About_dates}>
				<span>{dateDesc}</span>
			</div>
			<div className={styles.About_streak}>
				<span>Streak: </span>
				<span>{maxStreak}</span>
			</div>
		</div>
	);
};

const HabitCard = ({ habit }: Props) => {
	const navigate = useNavigate();
	const { habitsLogged, habitTarget, habitName, habitUnit, icon, iconColor } =
		habit;
	const iconName = habitIcons[icon as keyof object];

	const goToHabit = () => {
		const id = habit.habitID;
		const path = `/habits/${id}/tracker`;
		navigate(path);
	};

	return (
		<div className={styles.HabitCard}>
			<div className={styles.HabitCard_top}>
				<HabitHeader
					icon={iconName}
					color={iconColor}
					name={habitName}
					goTo={goToHabit}
				/>
			</div>
			<div className={styles.HabitCard_main}>
				<Total
					unit={habitUnit}
					targetValue={habitTarget}
					loggedValue={habitsLogged}
				/>
			</div>
			<div className={styles.HabitCard_bottom}>
				<About habit={habit} />
			</div>
		</div>
	);
};

export default HabitCard;
