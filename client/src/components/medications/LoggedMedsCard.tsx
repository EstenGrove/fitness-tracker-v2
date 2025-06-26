import { ReactNode } from "react";
import styles from "../../css/medications/LoggedMedsCard.module.scss";
import DetailsCard from "../layout/DetailsCard";

type Props = { pillsTakenToday: number; to?: string; children: ReactNode };

const getTakenTotal = (taken: number) => {
	if (!taken) return "0.00";
	return taken.toFixed(2);
};

const LoggedMedsCard = ({ pillsTakenToday, to = "", children }: Props) => {
	const takenToday = getTakenTotal(pillsTakenToday);
	return (
		<DetailsCard icon="pill" title="Today's Doses" to={to}>
			<div className={styles.LoggedMedsCard}>
				<div className={styles.LoggedMedsCard_title}>
					You've taken <b>{takenToday}</b> pills today
				</div>
				<div className={styles.LoggedMedsCard_main}>{children}</div>
			</div>
		</DetailsCard>
	);
};

export default LoggedMedsCard;
