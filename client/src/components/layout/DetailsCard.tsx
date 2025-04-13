import { ReactNode } from "react";
import styles from "../../css/layout/DetailsCard.module.scss";
import { iconsMap } from "../../utils/utils_icons";
import { Card, CardHeader, CardIcon, CardTitles } from "./Card";

type Props = {
	title: string;
	icon: keyof typeof iconsMap;
	to?: string;
	background?: string;
	color?: string;
	children?: ReactNode;
};

const DetailsCard = ({
	icon,
	title,
	to,
	background,
	color,
	children,
}: Props) => {
	return (
		<div className={styles.DetailsCard}>
			<Card>
				<CardHeader to={to}>
					<CardIcon icon={icon} background={background} color={color} />
					<CardTitles title={title} />
				</CardHeader>
				<div className={styles.DetailsCard_inner}>{children}</div>
			</Card>
		</div>
	);
};

export default DetailsCard;
