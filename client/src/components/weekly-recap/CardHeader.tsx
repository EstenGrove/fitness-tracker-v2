import { ReactNode } from "react";
import styles from "../../css/weekly-recap/CardHeader.module.scss";

type Props = { children?: ReactNode };

const CardHeader = ({ children }: Props) => {
	return (
		<div className={styles.CardHeader}>
			{children}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default CardHeader;
