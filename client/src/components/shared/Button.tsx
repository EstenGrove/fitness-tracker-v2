import { ComponentPropsWithoutRef, CSSProperties, ReactNode } from "react";
import css from "../../css/shared/Button.module.scss";

interface Props extends ComponentPropsWithoutRef<"button"> {
	children: ReactNode;
	onClick: () => void;
	isDisabled?: boolean;
	styles?: CSSProperties;
}

const Button = ({
	children,
	onClick,
	isDisabled = false,
	styles = {},
	...rest
}: Props) => {
	return (
		<button
			className={css.Button}
			onClick={onClick}
			disabled={isDisabled}
			style={styles}
			{...rest}
		>
			{children}
		</button>
	);
};

export default Button;
