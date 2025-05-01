import styles from "../../css/ui/InfoBanner.module.scss";
import sprite from "../../assets/icons/main.svg";
import FadeIn from "./FadeIn";
import { iconsMap } from "../../utils/utils_icons";

type Props = {
	title: string;
	msg: string;
	icon: keyof typeof iconsMap;
};

const InfoBanner = ({ title, msg, icon }: Props) => {
	const iconName = iconsMap[icon];
	return (
		<FadeIn>
			<div className={styles.InfoBanner}>
				<div className={styles.InfoBanner_wrapper}>
					<svg className={styles.InfoBanner_wrapper_icon}>
						<use xlinkHref={`${sprite}#icon-${iconName}`}></use>
					</svg>
				</div>
				<div className={styles.InfoBanner_content}>
					<div className={styles.InfoBanner_content_title}>{title}</div>
					<div className={styles.InfoBanner_content_msg}>{msg}</div>
				</div>
			</div>
		</FadeIn>
	);
};

export default InfoBanner;
