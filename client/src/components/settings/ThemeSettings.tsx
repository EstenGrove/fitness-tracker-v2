import styles from "../../css/settings/ThemeSettings.module.scss";
import SettingsSection from "./SettingsSection";
import TrendsAccentPicker from "./TrendsAccentPicker";

const ThemeSettings = () => {
	return (
		<div className={styles.ThemeSettings}>
			<SettingsSection title="Trends accent color">
				<TrendsAccentPicker />
			</SettingsSection>
		</div>
	);
};

export default ThemeSettings;
