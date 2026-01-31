import { JSX, ReactNode } from "react";
import styles from "../../css/recaps-carousel/RecapsCard.module.scss";
import { renderContent } from "../../utils/utils_recaps";

type Props = {
	isActive: boolean;
	header?: JSX.Element | ReactNode;
	body?: JSX.Element | ReactNode;
	children?: ReactNode;
};

const RecapsCard = ({ isActive = false, header, body, children }: Props) => {
	if (!isActive) return null;
	return (
		<div className={styles.RecapsCard}>
			{renderContent(header)}
			{renderContent(body)}
			{renderContent(children)}
		</div>
	);
};

export default RecapsCard;
