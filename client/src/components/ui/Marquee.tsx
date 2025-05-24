import { ComponentPropsWithoutRef } from "react";
import styles from "../../css/ui/Marquee.module.scss";

type MarqueeProps = {
	text: string;
	length?: string;
	fontSize?: string;
	fontWeight?: string | number;
};

interface Props extends MarqueeProps, ComponentPropsWithoutRef<"div"> {}

const Marquee = ({
	text,
	fontSize = "1.5rem",
	fontWeight = 500,
	length = "10s",
	...rest
}: Props) => {
	const css = { fontSize, fontWeight };
	const anim = { animationDuration: length, fontSize, fontWeight };
	return (
		<div className={styles.Marquee} style={css} {...rest}>
			<div className={styles.Marquee_content} style={anim}>
				{text}
			</div>
		</div>
	);
};

export default Marquee;
