import { LocalStorage } from "./utils_storage";

const themeKey = "APP_THEME";
const storage = new LocalStorage();

const setTheme = (theme: "light" | "dark") => {
	document.documentElement.dataset.theme = theme;
	storage.set(themeKey, theme);
};

const getTheme = () => {
	const theme = storage.get(themeKey);

	return theme || "dark";
};

const setInitialTheme = () => {
	const theme = storage.get(themeKey);
	if (theme) {
		setTheme(theme);
	} else {
		setTheme("dark");
	}
};

/**
 * TRENDS ACCENT COLOR
 * - The trends hub's data color (charts & bars), picked in Settings > Theme
 * - Stored per device as a hex string; null = the default from index.css (--accent-blue)
 * - Applied as an inline '--trends-accent-primary' on <html>, which overrides the :root default
 */

const trendsAccentKey = "APP_TRENDS_ACCENT";
const trendsAccentVar = "--trends-accent-primary";

const applyTrendsAccent = (color: string | null) => {
	const root = document.documentElement;
	if (color) {
		root.style.setProperty(trendsAccentVar, color);
	} else {
		root.style.removeProperty(trendsAccentVar);
	}
};

const getTrendsAccent = (): string | null => {
	return storage.get<string>(trendsAccentKey);
};

// Pass null to reset to the default
const setTrendsAccent = (color: string | null) => {
	applyTrendsAccent(color);
	if (color) {
		storage.set(trendsAccentKey, color);
	} else {
		storage.remove(trendsAccentKey);
	}
};

// Called on page load (index.html), before React renders, so there's no flash of the default
const setInitialTrendsAccent = () => {
	applyTrendsAccent(getTrendsAccent());
};

export {
	getTheme,
	setTheme,
	themeKey,
	setInitialTheme,
	// Trends accent
	getTrendsAccent,
	setTrendsAccent,
	setInitialTrendsAccent,
};
