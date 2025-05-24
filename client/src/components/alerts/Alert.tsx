import styles from "../../css/alerts/Alert.module.scss";
import { AlertType } from "../../utils/utils_alerts";

type Props = {
	type: AlertType;
	title: string;
	subtitle?: string;
	message?: string;
};

const Alert = ({ type = "INFO", title, subtitle, message }: Props) => {
	return (
		<div className={styles.Alert}>
			{/*  */}
			{/*  */}
		</div>
	);
};

export default Alert;
