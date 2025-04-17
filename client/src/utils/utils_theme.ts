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

export { getTheme, setTheme, themeKey, setInitialTheme };
