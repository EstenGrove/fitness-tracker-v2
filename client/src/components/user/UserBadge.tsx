import { ComponentPropsWithoutRef } from "react";
import styles from "../../css/user/UserBadge.module.scss";
import { CurrentUser } from "../../features/user/types";

type Props = {
	currentUser: CurrentUser;
	onClick?: () => void;
	size: keyof typeof sizes;
};

const getInitials = (user: CurrentUser) => {
	if (!user || !("firstName" in user) || !("lastName" in user)) {
		return "NU";
	} else {
		const { firstName, lastName } = user;
		const first = firstName.slice(0, 1);
		const last = lastName.slice(0, 1);
		const initials = first + last;
		return initials;
	}
};

const sizes = {
	XSM: styles.UserBadgeXSM,
	SM: styles.UserBadgeSM,
	MD: styles.UserBadgeMD,
	LG: styles.UserBadgeLG,
	XLG: styles.UserBadgeXLG,
	CUSTOM: styles.UserBadge,
} as const;

// @ts-expect-error: this is fine
interface BadgeProps extends Props, ComponentPropsWithoutRef<"div"> {}

const UserBadge = ({
	currentUser,
	onClick,
	size = "MD",
	...rest
}: BadgeProps) => {
	const initials = getInitials(currentUser);
	const badgeSize = sizes[size];

	const handleClick = () => {
		return onClick && onClick();
	};

	return (
		<div className={badgeSize} onClick={handleClick} {...rest}>
			<div>{initials}</div>
		</div>
	);
};

export default UserBadge;
