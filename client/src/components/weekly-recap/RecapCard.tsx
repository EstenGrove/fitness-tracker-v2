import { JSX, ReactNode } from "react";
import { IconKey } from "../../utils/utils_icons";
import RecapCardLayout from "./RecapCardLayout";

type Props = {
	isActive: boolean;
	header: JSX.Element | ReactNode;
	body: JSX.Element | ReactNode;
	icon?: IconKey;
	color?: string;
};

const RecapCard = ({ header, body, icon, color }: Props) => {
	return (
		<RecapCardLayout header={header} body={body} icon={icon} color={color} />
	);
};

export default RecapCard;
