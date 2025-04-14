import sprite from "../../assets/icons/main.svg";
import sprite2 from "../../assets/icons/dashboard.svg";
import styles from "../../css/layout/TopNav.module.scss";
import { RefObject, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { LocalStorage } from "../../utils/utils_storage";

const THEME_KEY = "APP_THEME";
const storage = new LocalStorage();

const toggleTheme = () => {
	const cacheTheme = storage.get(THEME_KEY);
	const isDark =
		cacheTheme === "dark" || document.documentElement.dataset.theme === "dark";
	if (isDark) {
		document.documentElement.dataset.theme = "light";
		storage.set(THEME_KEY, "light");
	} else {
		document.documentElement.dataset.theme = "dark";
		storage.set(THEME_KEY, "dark");
	}
};

type Props = {
	onLogout: () => void;
};

const LogoutButton = ({ onLogout }: { onLogout: () => void }) => {
	return (
		<button type="button" onClick={onLogout} className={styles.LogoutButton}>
			<svg className={styles.LogoutButton_icon}>
				<use xlinkHref={`${sprite}#icon-logout`}></use>
			</svg>
		</button>
	);
};

type SidePanelProps = {
	closePanel: () => void;
};

const SidePanel = ({ closePanel }: SidePanelProps) => {
	const panelRef = useRef<HTMLDivElement>(null);
	useOutsideClick(panelRef as RefObject<HTMLDivElement>, closePanel);

	return (
		<div className={`${styles.SidePanel} ${styles.slideIn}`} ref={panelRef}>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

const TopNav = ({ onLogout }: Props) => {
	const [showSidePanel, setShowSidePanel] = useState<boolean>(false);

	const openPanel = () => setShowSidePanel(true);
	const closePanel = () => setShowSidePanel(false);

	return (
		<nav className={styles.TopNav}>
			<ul className={styles.TopNav_list}>
				<li className={styles.TopNav_list_item} onClick={openPanel}>
					<svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite2}#icon-sidebar`}></use>
					</svg>
				</li>
				<li className={styles.TopNav_list_item} onClick={toggleTheme}>
					<svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite2}#icon-brightness_4`}></use>
					</svg>
				</li>
				<li className={styles.TopNav_list_item}>
					<LogoutButton onLogout={onLogout} />
				</li>
			</ul>

			{showSidePanel && <SidePanel closePanel={closePanel} />}
		</nav>
	);
};

export default TopNav;
