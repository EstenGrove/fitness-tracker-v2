import { ReactNode } from "react";
import styles from "../../css/weekly-recap/RecapCardBody.module.scss";

type Props = {
	children?: ReactNode;
};

const RecapCardBody = ({ children }: Props) => {
	return (
		<div className={styles.RecapCardBody}>
			<div className={styles.RecapCardBody_inner}>{children}</div>
		</div>
	);
};

export default RecapCardBody;
