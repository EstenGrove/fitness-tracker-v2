import { NavLink } from "react-router";
import styles from "../../css/history/HistoryTabs.module.scss";
import { ReactNode } from "react";

type NavButtonProps = {
	to: string;
	children?: ReactNode;
	isEnd?: boolean;
};

const isActiveRoute = ({ isActive }: { isActive: boolean }) => {
	if (isActive) {
		return `${styles.PageTabButton} ${styles.isActive}`;
	} else {
		return styles.PageTabButton;
	}
};
const PageTabButton = ({ to, children, isEnd = false }: NavButtonProps) => {
	return (
		<NavLink to={to} className={isActiveRoute} end={isEnd}>
			{children}
		</NavLink>
	);
};

const HistoryTabs = () => {
	return (
		<div className={styles.HistoryTabs}>
			<div className={styles.HistoryTabs_inner}>
				<PageTabButton to="" isEnd={true}>
					All
				</PageTabButton>
				<PageTabButton to="strength">Strength</PageTabButton>
				<PageTabButton to="cardio">Cardio</PageTabButton>
				<PageTabButton to="stretch">Stretch</PageTabButton>
				<PageTabButton to="walk">Walk</PageTabButton>
				<PageTabButton to="timed">Timed</PageTabButton>
				<PageTabButton to="other">Other</PageTabButton>
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default HistoryTabs;
