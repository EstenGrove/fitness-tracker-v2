import { JSX, ReactNode, ReactElement } from "react";
import styles from "../../css/weekly-recap/RecapCardLayout.module.scss";
import RecapCardHeader from "./RecapCardHeader";
import RecapCardBody from "./RecapCardBody";
import { IconKey } from "../../utils/utils_icons";

type Props = {
	icon?: IconKey | null;
	color?: string;
	header: JSX.Element | ReactNode | ReactElement;
	body: JSX.Element | ReactNode | ReactElement;
};

const RecapCardLayout = ({
	icon = null,
	color = "var(--blueGrey700)",
	header,
	body,
}: Props) => {
	return (
		<div className={styles.RecapCardLayout}>
			{/* Header */}
			<RecapCardHeader icon={icon} color={color}>
				{header}
			</RecapCardHeader>
			{/* Body */}
			<RecapCardBody>{body}</RecapCardBody>
		</div>
	);
};

export default RecapCardLayout;
