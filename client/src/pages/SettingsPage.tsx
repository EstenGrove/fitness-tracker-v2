import styles from "../css/pages/SettingsPage.module.scss";
import { SettingCategory, SettingOption } from "../utils/utils_settings";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store/store";
import { setSelectedSetting } from "../features/settings/slice";
import { useSettingsNavItems } from "../hooks/useSettingsNavItems";
import { groupBy, isEmptyObj } from "../utils/utils_misc";
import PageContainer from "../components/layout/PageContainer";
import SettingsSection from "../components/settings/SettingsSection";
import SettingsOptions from "../components/settings/SettingsOptions";

// REQUIREMENTS:
// - Show accordion sections for:
// - User, Workouts, Medications, History, Dashboard etc.

type SettingsByCategory = Record<SettingCategory, SettingOption[]>;

const groupSettingsBy = (
	items: SettingOption[],
	by: "category" | "label" | "route" = "category"
) => {
	if (!items || !items.length) return {} as SettingsByCategory;

	return groupBy(by, items) as SettingsByCategory;
};

const SettingsPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const { data } = useSettingsNavItems();

	const settingsItems = data?.settingsItems ?? [];
	const settingsByCategory = groupSettingsBy(settingsItems);

	const onSelect = (option: SettingOption) => {
		if (option?.route) {
			dispatch(setSelectedSetting(option));
			navigate(option?.route);
		}
	};

	return (
		<PageContainer>
			<div className={styles.SettingsPage}>
				<div className={styles.SettingsPage_header}>
					<h2>Settings</h2>
				</div>
				<div className={styles.SettingsPage_main}>
					{!isEmptyObj(settingsByCategory) &&
						Object.keys(settingsByCategory).map((category, idx) => {
							const key = `${category}-${idx}`;
							const settings = settingsByCategory[category as keyof object];

							return (
								<SettingsSection key={key} title={category}>
									<SettingsOptions options={settings} onSelect={onSelect} />
								</SettingsSection>
							);
						})}
				</div>
			</div>
		</PageContainer>
	);
};

export default SettingsPage;
