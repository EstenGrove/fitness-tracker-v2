import styles from "../../css/recaps-shared/TotalsItem.module.scss";
import { getIcon, getSprite, IconKey } from "../../utils/utils_icons";
import { addEllipsis } from "../../utils/utils_misc";
import NumberCounter from "../ui/NumberCounter";

type Props = {
	total: number | string;
	label: string;
	subLabel?: string;
	icon?: IconKey;
	color?: string;
};

const TotalsItem = ({
	total,
	label,
	subLabel = "",
	icon = "effort",
	color = "var(--blueGrey300)",
}: Props) => {
	const sheet = getSprite(icon);
	const iconName = getIcon(icon);
	const topLabel = addEllipsis(label, 14);

	if (icon === "weightLift") {
		console.log("icon info", {
			icon,
			iconName,
			sheet,
		});
	}
	return (
		<div
			className={styles.TotalsItem}
			style={{ borderColor: "var(--blueGrey900)" }}
		>
			<div className={styles.TotalsItem}>
				<div className={styles.TotalsItem_top}>
					<svg className={styles.TotalsItem_top_icon} style={{ fill: color }}>
						<use xlinkHref={`${sheet}#icon-${iconName}`}></use>
					</svg>
					<div className={styles.TotalsItem_top_label}>{topLabel}</div>
				</div>
				<div className={styles.TotalsItem_total} style={{ color: color }}>
					<div>
						<NumberCounter number={total} />
					</div>
					<div>{subLabel}</div>
				</div>
			</div>
		</div>
	);
};

export default TotalsItem;
