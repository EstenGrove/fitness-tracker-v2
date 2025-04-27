import sprite from "../../assets/icons/main.svg";
import { NavLink } from "react-router";
import styles from "../../css/layout/Navbar.module.scss";

const isActiveRoute = ({ isActive }: { isActive: boolean }) => {
	if (isActive) {
		return `${styles.Navbar_list_item} ${styles.isActive}`;
	} else {
		return `${styles.Navbar_list_item}`;
	}
};

const Navbar = () => {
	return (
		<nav className={styles.Navbar}>
			<ul className={styles.Navbar_list}>
				<li className={styles.Navbar_list_item}>
					<NavLink to="/" className={isActiveRoute} viewTransition>
						<svg className={styles.Navbar_list_item_icon}>
							<use xlinkHref={`${sprite}#icon-dashboard-layout`}></use>
						</svg>
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="workouts" className={isActiveRoute} viewTransition>
						<svg className={styles.Navbar_list_item_icon}>
							<use xlinkHref={`${sprite}#icon-weightlift-2`}></use>
						</svg>
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="history" className={isActiveRoute} viewTransition>
						<svg className={styles.Navbar_list_item_icon}>
							<use xlinkHref={`${sprite}#icon-property-time`}></use>
						</svg>
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="meds" className={isActiveRoute} viewTransition>
						<svg className={styles.Navbar_list_item_icon}>
							<use xlinkHref={`${sprite}#icon-pill`}></use>
						</svg>
					</NavLink>
				</li>
				<li className={styles.Navbar_list_item}>
					<NavLink to="settings" className={isActiveRoute} viewTransition>
						<svg className={styles.Navbar_list_item_icon}>
							<use xlinkHref={`${sprite}#icon-settings`}></use>
						</svg>
					</NavLink>
				</li>
			</ul>
		</nav>
	);
};

export default Navbar;
