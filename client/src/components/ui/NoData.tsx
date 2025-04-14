import sprite from "../../assets/icons/main.svg";
import styles from "../../css/ui/NoData.module.scss";
import { iconsMap } from "../../utils/utils_icons";

type Props = {
	icon?: keyof typeof iconsMap;
	msg?: string;
};

const NoData = ({ icon = "empty", msg = "No data." }: Props) => {
	const name = iconsMap[icon];
	return (
		<div className={styles.NoData}>
			<svg className={styles.NoData_icon}>
				<use xlinkHref={`${sprite}#icon-${name}`} />
			</svg>
			<span>{msg}</span>
		</div>
	);
};

export default NoData;
