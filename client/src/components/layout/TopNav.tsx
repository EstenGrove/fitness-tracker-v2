import sprite from "../../assets/icons/main2.svg";
import sprite2 from "../../assets/icons/dashboard.svg";
import styles from "../../css/layout/TopNav.module.scss";
import { CurrentUser } from "../../features/user/types";
import { RefObject, useRef, useState } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	currentUser: CurrentUser;
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

const TopNav = ({ currentUser, onLogout }: Props) => {
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
				<li className={styles.TopNav_list_item}>
					{/* <svg className={styles.TopNav_list_item_icon}>
						<use xlinkHref={`${sprite2}#icon-more_vert`}></use>
					</svg> */}
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
