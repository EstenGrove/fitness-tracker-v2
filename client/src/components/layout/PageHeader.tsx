import { ReactNode } from "react";
import { format } from "date-fns";
import styles from "../../css/layout/PageHeader.module.scss";

type Props = {
	title: string;
	date?: Date | string;
	children?: ReactNode;
};

const getTodaysDate = (date?: Date | string) => {
	if (!date) {
		const now = new Date();
		const today = format(now, "EEE, MMM do");

		return today;
	} else {
		const today = format(date, "EEE, MMM do");
		return today;
	}
};

type TitlesProps = {
	title: string;
	date?: Date | string;
};

const Titles = ({ title, date }: TitlesProps) => {
	const today = getTodaysDate(date);
	return (
		<div className={styles.Titles}>
			<div className={styles.Titles_today}>{today}</div>
			<h2 className={styles.Titles_label}>{title}</h2>
		</div>
	);
};

const PageHeader = ({ title, date, children }: Props) => {
	return (
		<div className={styles.PageHeader}>
			<div className={styles.PageHeader_main}>
				<Titles title={title} date={date} />
				<div className={styles.PageHeader_main_right}>{children}</div>
			</div>
		</div>
	);
};

export default PageHeader;
