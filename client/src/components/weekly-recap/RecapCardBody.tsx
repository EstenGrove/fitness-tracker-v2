import { ReactNode } from "react";
import styles from "../../css/weekly-recap/RecapCardBody.module.scss";

type Props = {
	children?: ReactNode;
};

const RecapCardBody = ({ children }: Props) => {
	return <div className={styles.RecapCardBody}>{children}</div>;
};

export default RecapCardBody;
