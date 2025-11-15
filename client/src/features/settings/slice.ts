import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { SettingOption, SettingsByCategory } from "../../utils/utils_settings";
import { RootState } from "../../store/store";

interface SelectedSetting {
	[key: string]: unknown;
	option: SettingOption;
}

interface SettingsSlice {
	settings: SettingsByCategory;
	selected: SelectedSetting | null;
}

const initialState: SettingsSlice = {
	settings: {} as SettingsByCategory,
	selected: null,
};

const settingsSlice = createSlice({
	name: "settings",
	initialState: initialState,
	reducers: {
		setSelectedSetting(
			state: SettingsSlice,
			action: PayloadAction<SettingOption>
		) {
			state.selected = {
				option: action.payload,
			};
		},
		findCurrentSetting(
			state: SettingsSlice,
			action: PayloadAction<{ settings: SettingsByCategory; route: string }>
		) {
			const { settings, route: path } = action.payload;
			const paths = path.split("/");
			const route = paths[paths.length - 1];

			const allSettings = Object.values(settings).flat();
			const match = allSettings.find((setting) => {
				return setting.route === route;
			});
			if (match) {
				state.selected = {
					option: match,
				};
			}
		},
	},
});

export const selectSettings = (state: RootState) => {
	return state.settings.settings as SettingsByCategory;
};

export const selectCurrentSetting = (state: RootState) => {
	return state.settings.selected as SelectedSetting;
};

export const { setSelectedSetting } = settingsSlice.actions;

export default settingsSlice.reducer;
