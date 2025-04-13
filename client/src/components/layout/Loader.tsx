import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "../../css/layout/Loader.module.scss";

type LoaderProps = {
	children?: ReactNode;
};

interface Props extends LoaderProps, ComponentPropsWithoutRef<"div"> {}

const Loader = ({ children, ...rest }: Props) => {
	return (
		<div className={styles.Loader} {...rest}>
			<div className={styles.ripple}>
				<div></div>
				<div></div>
			</div>
			<div className={styles.Loader_inner}>{children}</div>
		</div>
	);
};

export default Loader;
