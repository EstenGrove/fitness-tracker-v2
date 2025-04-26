import { ComponentPropsWithoutRef, useState, useEffect } from "react";
import styles from "../../css/ui/ProgressBar.module.scss";

interface BarProps {
	progress: number;
	color?: string;
}

interface Props extends BarProps, ComponentPropsWithoutRef<"div"> {}

const ProgressBar = ({
	progress,
	color = "var(--accent-blue)",
	...rest
}: Props) => {
	const [value, setValue] = useState(0);
	const css = {
		width: value + "%",
		backgroundColor: color,
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (progress) {
			setValue(progress);
		}

		return () => {
			isMounted = false;
		};
	}, [progress]);

	return (
		<div className={styles.ProgressBar} {...rest}>
			<div className={styles.ProgressBar_track}>
				<div className={styles.ProgressBar_track_value} style={css}></div>
			</div>
		</div>
	);
};

export default ProgressBar;
