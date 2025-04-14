import { ReactNode, RefObject, useRef } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/MenuDropdown.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";

type Props = {
	closeMenu: () => void;
	children?: ReactNode;
};
type IconProps = {
	openMenu: () => void;
};

export type MenuAction = "EDIT" | "VIEW" | "DELETE" | "COMPLETE" | "CANCEL";

const MenuIcon = ({ openMenu }: IconProps) => {
	return (
		<div onClick={openMenu} className={styles.MenuIcon}>
			<svg className={styles.MenuIcon_icon}>
				<use xlinkHref={`${sprite}#icon-keyboard_control`}></use>
			</svg>
		</div>
	);
};

const MenuDropdown = ({ closeMenu, children }: Props) => {
	const menuRef = useRef<HTMLDivElement>(null);
	useOutsideClick(menuRef as RefObject<HTMLInputElement>, closeMenu);
	return (
		<div ref={menuRef} className={styles.MenuDropdown}>
			<ul className={styles.MenuDropdown_list}>{children}</ul>
		</div>
	);
};

export { MenuIcon };
export default MenuDropdown;
