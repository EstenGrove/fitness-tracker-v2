import { ReactNode } from "react";
import styles from "../../css/layout/PageTabs.module.scss";
import { NavLink } from "react-router";

type NavButtonProps = {
	to: string;
	children?: ReactNode;
	isEnd?: boolean;
};

const isActiveRoute = ({ isActive }: { isActive: boolean }) => {
	if (isActive) {
		return `${styles.PageTabButton} ${styles.isActive}`;
	} else {
		return styles.PageTabButton;
	}
};

const PageTabButton = ({ to, children, isEnd = false }: NavButtonProps) => {
	return (
		<NavLink to={to} className={isActiveRoute} end={isEnd}>
			{children}
		</NavLink>
	);
};

type Props = { children: ReactNode };

const PageTabs = ({ children }: Props) => {
	return (
		<div className={styles.PageTabs}>
			<div className={styles.PageTabs_inner}>
				{children}
				{/*  */}
			</div>
		</div>
	);
};

export { PageTabs, PageTabButton };
