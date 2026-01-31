import { CSSProperties, ReactNode } from "react";
import css from "../../css/recaps-carousel/RecapsBody.module.scss";

type Props = {
	children?: ReactNode;
	styles?: CSSProperties;
};

const RecapsBody = ({ children, styles = {} }: Props) => {
	return (
		<div className={css.RecapsBody} style={styles}>
			{children}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default RecapsBody;
