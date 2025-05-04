import { ReactNode } from "react";
import styles from "../../css/medications/LoggedMedsCard.module.scss";
import DetailsCard from "../layout/DetailsCard";

type Props = { pillsTakenToday: number; children: ReactNode };

const LoggedMedsCard = ({ pillsTakenToday, children }: Props) => {
	return (
		<DetailsCard icon="pill" title="Today's Doses">
			<div className={styles.LoggedMedsCard}>
				<div className={styles.LoggedMedsCard_title}>
					You've taken <b>{pillsTakenToday || "0.00"}</b> pills today
				</div>
				<div className={styles.LoggedMedsCard_main}>{children}</div>
			</div>
		</DetailsCard>
	);
};

export default LoggedMedsCard;
