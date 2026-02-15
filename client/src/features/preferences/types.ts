import { TStatus } from "../types";

export type TzPreference = "UTC" | "Local";

export type LanguagePreference = "en" | "es" | "fr" | "de" | "it" | "pt" | "ru";

export type ThemePreference = "light" | "dark" | "system";

export type NotificationType = "email" | "sms" | "in-app";

export type GeneralPreferences = {
	language: LanguagePreference;
	timezone: TzPreference;
};

export type AppearancePreferences = {
	theme: ThemePreference;
	workoutIsland: boolean;
};

export type NotificationPreferences = {
	workoutReminders: {
		enabled: boolean;
		type: NotificationType;
	};
	weeklySummary: {
		enabled: boolean;
		type: NotificationType;
	};
};

export interface Preferences {
	// ##TODO
	general: GeneralPreferences;
	appearance: AppearancePreferences;
	// ##TODO
	notifications: NotificationPreferences;
}

export interface PreferencesSlice {
	preferences: Preferences;
	status: TStatus;
}
