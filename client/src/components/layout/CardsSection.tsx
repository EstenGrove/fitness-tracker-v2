import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "../../css/layout/CardsSection.module.scss";
import { NavLink } from "react-router";

interface CardSectionProps {
	to: string;
	title?: string;
	children?: ReactNode;
}

const ShowAllLink = ({ to }: { to: string }) => {
	return (
		<NavLink to={to} className={styles.ShowAll}>
			Show All
		</NavLink>
	);
};

interface Props extends CardSectionProps, ComponentPropsWithoutRef<"div"> {}

const CardsSection = ({ to, title, children, ...rest }: Props) => {
	return (
		<div className={styles.CardsSection} {...rest}>
			<div className={styles.CardsSection_header}>
				<h4>{title}</h4>
				<ShowAllLink to={to} />
			</div>
			<div className={styles.CardsSection_body}>{children}</div>
		</div>
	);
};

export default CardsSection;
