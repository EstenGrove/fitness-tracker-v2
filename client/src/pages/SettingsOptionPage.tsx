import styles from "../css/pages/SettingsOptionPage.module.scss";
import { useNavigate, useParams } from "react-router";
import { useSelector } from "react-redux";
import { selectCurrentSetting } from "../features/settings/slice";
import { ComponentType, lazy } from "react";

type SettingsComponentsMap = Record<string, ComponentType | null>;

const settingsComponents: SettingsComponentsMap = {
	theme: lazy(() => import("../components/settings/ThemeSettings")),
	deactivate: lazy(() => import("../components/settings/DeactivateSettings")),
	jobs: lazy(() => import("../components/settings/JobsSettings")),
	"export-workouts": lazy(
		() => import("../components/settings/ExportSettings")
	),
	"export-meds": lazy(() => import("../components/settings/ExportSettings")),
	"export-sessions": lazy(
		() => import("../components/settings/ExportSettings")
	),
	profile: lazy(() => import("../components/settings/ProfileSettings")),
	"reset-password": lazy(
		() => import("../components/settings/ResetPasswordSettings")
	),
	preferences: lazy(() => import("../components/settings/PreferencesSettings")),
};

const SettingsOptionPage = () => {
	const navigate = useNavigate();
	const { id: route } = useParams();
	const current = useSelector(selectCurrentSetting);
	const currentSetting = current?.option;
	const Component = settingsComponents[route as keyof object];

	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles.SettingsOptionPage}>
			<div onClick={goBack} className={styles.SettingsOptionPage_back}>
				{"< Back"}
			</div>
			<div className={styles.SettingsOptionPage_header}>
				{currentSetting?.label ?? ""}
			</div>
			{Component && <Component />}
		</div>
	);
};

export default SettingsOptionPage;
