import { CSSProperties, ReactNode } from "react";
import { format } from "date-fns";
import css from "../../css/layout/PageHeader.module.scss";

interface Props {
	title: string;
	date?: Date | string;
	children?: ReactNode;
	styles?: CSSProperties | undefined;
}

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
		<div className={css.Titles}>
			<div className={css.Titles_today}>{today}</div>
			<h2 className={css.Titles_label}>{title}</h2>
		</div>
	);
};

const PageHeader = ({ title, date, children, styles = {} }: Props) => {
	return (
		<div className={css.PageHeader} style={styles}>
			<div className={css.PageHeader_main}>
				<Titles title={title} date={date} />
				<div className={css.PageHeader_main_right}>{children}</div>
			</div>
		</div>
	);
};

export default PageHeader;
