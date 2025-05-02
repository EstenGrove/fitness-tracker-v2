import { ReactNode, RefObject, useEffect, useRef, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/MenuDropdown.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { createPortal } from "react-dom";

type Props = {
	triggerRef?: RefObject<HTMLElement | null> | undefined;
	closeMenu: () => void;
	usePortal?: boolean;
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

const MenuDropdown = ({
	triggerRef,
	closeMenu,
	children,
	usePortal = false,
}: Props) => {
	const menuRef = useRef<HTMLDivElement>(null);
	useOutsideClick(menuRef, closeMenu);
	const [pos, setPos] = useState<{ top: number; right: number }>({
		top: 0,
		right: 0,
	});

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (usePortal && triggerRef && triggerRef.current) {
			const rect = triggerRef.current.getBoundingClientRect();
			setPos({
				top: rect.bottom,
				right: rect.right,
			});
		}

		return () => {
			isMounted = false;
		};
	}, [triggerRef, usePortal]);

	if (usePortal) {
		return createPortal(
			<div
				ref={menuRef}
				className={styles.MenuDropdown}
				style={{
					position: "absolute",
					top: pos.top,
					left: pos.right - 120,
					zIndex: 9999,
				}}
			>
				<ul className={styles.MenuDropdown_list}>{children}</ul>
			</div>,
			document.body // Specify the container element
		);
	}
	return (
		<div ref={menuRef} className={styles.MenuDropdown}>
			<ul className={styles.MenuDropdown_list}>{children}</ul>
		</div>
	);
};

export { MenuIcon };
export default MenuDropdown;
