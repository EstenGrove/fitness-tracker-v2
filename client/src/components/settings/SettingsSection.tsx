import { ReactNode } from "react";
import styles from "../../css/settings/SettingsSection.module.scss";

type Props = {
	title: string;
	children?: ReactNode;
};

const SettingsSection = ({ title, children }: Props) => {
	return (
		<div className={styles.SettingsSection}>
			<div className={styles.SettingsSection_header}>{title}</div>
			<div className={styles.SettingsSection_header_options}>{children}</div>
		</div>
	);
};

export default SettingsSection;
