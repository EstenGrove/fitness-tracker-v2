import { ComponentPropsWithoutRef, ReactNode } from "react";
import styles from "../../css/layout/PageContainer.module.scss";

type ContainerProps = { padding?: string; children?: ReactNode };

interface Props extends ContainerProps, ComponentPropsWithoutRef<"div"> {}

const PageContainer = ({
	children,
	padding = "1rem 2.5rem",
	...rest
}: Props) => {
	const css = { padding };

	return (
		<div className={styles.PageContainer} style={css} {...rest}>
			{children}
		</div>
	);
};

export default PageContainer;
