import {
	ComponentPropsWithoutRef,
	ReactNode,
	RefObject,
	useState,
} from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/layout/SectionAccordion.module.scss";

interface AccordionProps {
	title: string;
	elementRef?: RefObject<HTMLDivElement | null>;
	children?: ReactNode;
	onToggle?: (isOpen: boolean) => void;
}

// @ts-expect-error: this is fine
interface Props extends AccordionProps, ComponentPropsWithoutRef<"div"> {}

const icon = "expand_more";

const SectionAccordion = ({
	title = "Summary Breakdown",
	elementRef,
	children,
	onToggle,
	...rest
}: Props) => {
	const [isExpanded, setIsExpanded] = useState<boolean>(true);
	const caretCss = {
		transform: isExpanded ? "rotate(0)" : "rotate(-90deg)",
		transition: "all .2s ease-in",
	};

	const toggleOpen = () => {
		const isOpen = !isExpanded;
		setIsExpanded(isOpen);

		return onToggle && onToggle(isOpen);
	};

	return (
		<div ref={elementRef} className={styles.SectionAccordion} {...rest}>
			<div className={styles.SectionAccordion_top} onClick={toggleOpen}>
				<div className={styles.SectionAccordion_top_title}>{title}</div>
				<div className={styles.SectionAccordion_top_wrapper}>
					<svg
						className={styles.SectionAccordion_top_wrapper_caret}
						style={caretCss}
					>
						<use xlinkHref={`${sprite}#icon-${icon}`}></use>
					</svg>
				</div>
			</div>

			<div
				className={`${styles.SectionAccordion_main} ${
					isExpanded ? styles.isExpanded : ""
				}`}
			>
				<div className={styles.SectionAccordion_main_content}>{children}</div>
			</div>
		</div>
	);
};

export default SectionAccordion;
