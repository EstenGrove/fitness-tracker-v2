import {
	Children,
	FC,
	ReactElement,
	ReactNode,
	useState,
	isValidElement,
	cloneElement,
} from "react";
import styles from "../../css/dashboard/DashboardSectionTabs.module.scss";

// --- Types ---

type Props = {
	initialIdx?: number;
	children?: ReactNode;
};

type TabBtnProps = {
	idx?: number; // injected
	activeIdx?: number; // injected
	onClick?: () => void; // injected
	children?: ReactNode;
};

type TabBtnsProps = {
	activeIdx?: number;
	onClick?: (idx: number) => void;
	children?: ReactElement<{
		activeIdx: number;
		onClick: (idx: number) => void;
	}>[];
};

type TabPanelProps = {
	isActive?: boolean; // injected
	children?: ReactNode;
};

type TabPanelsProps = {
	children?: ReactNode;
	activeIdx?: number;
};

// --- Components ---

const DashboardTabButton: FC<TabBtnProps> = ({
	idx,
	activeIdx,
	onClick,
	children,
}) => {
	const isActive = activeIdx === idx;
	const classes = [styles.DashboardTabButton, isActive && styles.isActive]
		.filter(Boolean)
		.join(" ");

	return (
		<button className={classes} onClick={onClick}>
			{children}
		</button>
	);
};

type Btn = {
	idx: number;
	activeIdx: number;
	onClick: (idx: number) => void;
};

const DashboardTabButtons: FC<TabBtnsProps> = ({
	activeIdx,
	onClick,
	children,
}: TabBtnsProps) => {
	const withProps = Children.map(children, (child, index) => {
		if (isValidElement(child)) {
			return cloneElement(child as ReactElement<Btn>, {
				idx: index,
				activeIdx,
				onClick: () => {
					return onClick && onClick(index);
				},
			});
		}
		return child;
	});

	return (
		<div className={styles.DashboardTabButtons}>
			<div className={styles.DashboardTabButtons_inner}>{withProps}</div>
		</div>
	);
};

const DashboardTabPanel: FC<TabPanelProps> = ({
	children,
	isActive,
}: TabPanelProps) => {
	return (
		<div className={styles.DashboardTabPanel} data-active={isActive}>
			{isActive ? children : null}
		</div>
	);
};

type Panel = {
	isActive: boolean;
};

const DashboardTabPanels: FC<TabPanelsProps> = ({ children, activeIdx }) => {
	const withProps = Children.map(children, (child, index) => {
		if (isValidElement(child)) {
			return cloneElement(child as ReactElement<Panel>, {
				isActive: index === activeIdx,
			});
		}
		return child;
	});

	return <div className={styles.DashboardTabPanels}>{withProps}</div>;
};

type CustomChild = {
	activeIdx: number;
	onClick: (idx: number) => void;
};

const DashboardSectionTabs: FC<Props> = ({ initialIdx = 0, children }) => {
	const [activeIdx, setActiveIdx] = useState<number>(initialIdx);

	const selectTab = (idx: number) => {
		setActiveIdx(idx);
	};

	const withProps = Children.map(children, (child) => {
		if (isValidElement(child)) {
			return cloneElement(child as ReactElement<CustomChild>, {
				activeIdx: activeIdx,
				onClick: selectTab,
			});
		}
		return child;
	});

	return (
		<div className={styles.DashboardSectionTabs}>
			<div className={styles.DashboardSectionTabs_inner}>{withProps}</div>
		</div>
	);
};

// --- Exports ---
export {
	DashboardSectionTabs,
	DashboardTabButton,
	DashboardTabButtons,
	DashboardTabPanel,
	DashboardTabPanels,
};
