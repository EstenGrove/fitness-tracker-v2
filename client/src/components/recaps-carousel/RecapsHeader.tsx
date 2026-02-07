import { ReactNode } from "react";
import styles from "../../css/recaps-carousel/RecapsHeader.module.scss";

type Props = { children?: ReactNode; accent?: string };

const RecapsHeader = ({ children }: Props) => {
	return <div className={styles.RecapsHeader}>{children}</div>;
};

export default RecapsHeader;
