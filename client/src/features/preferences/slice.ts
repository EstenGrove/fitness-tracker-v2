import {
	AppearancePreferences,
	GeneralPreferences,
	NotificationPreferences,
	Preferences,
	PreferencesSlice,
} from "./types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit/react";

// Default App Preferences

const defaultGeneral: GeneralPreferences = {
	language: "en",
	timezone: "UTC",
};

const defaultAppearance: AppearancePreferences = {
	theme: "dark",
	workoutIsland: true,
};

const defaultNotifications: NotificationPreferences = {
	workoutReminders: {
		enabled: false,
		type: "in-app",
	},
	weeklySummary: {
		enabled: false,
		type: "in-app",
	},
};

const initialState: PreferencesSlice = {
	status: "IDLE",
	preferences: {
		general: defaultGeneral,
		appearance: defaultAppearance,
		notifications: defaultNotifications,
	},
};

const preferencesSlice = createSlice({
	name: "preferences",
	initialState: initialState,
	reducers: {
		setPreferences(
			state: PreferencesSlice,
			action: PayloadAction<Preferences>
		) {
			state.preferences = action.payload;
		},
		updateGeneralPreference(
			state: PreferencesSlice,
			action: PayloadAction<{
				key: keyof Preferences["general"];
				value: string | boolean | number;
			}>
		) {
			const { key, value } = action.payload;
			state.preferences.general = {
				...state.preferences.general,
				[key]: value,
			};
		},
		updateAppearancePreference(
			state: PreferencesSlice,
			action: PayloadAction<{
				key: keyof Preferences["appearance"];
				value: string | boolean | number;
			}>
		) {
			const { key, value } = action.payload;
			state.preferences.appearance = {
				...state.preferences.appearance,
				[key]: value,
			};
		},
		updateNotificationPreference(
			state: PreferencesSlice,
			action: PayloadAction<{
				key: keyof Preferences["notifications"];
				value: string | boolean | number;
			}>
		) {
			const { key, value } = action.payload;
			state.preferences.notifications = {
				...state.preferences.notifications,
				[key]: value,
			};
		},
	},
});

export const {
	setPreferences,
	updateGeneralPreference,
	updateAppearancePreference,
	updateNotificationPreference,
} = preferencesSlice.actions;

export default preferencesSlice.reducer;
