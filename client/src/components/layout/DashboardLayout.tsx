import { Outlet, useNavigate } from "react-router";
import styles from "../../css/layout/DashboardLayout.module.scss";
import Navbar from "./Navbar";
import TopNav from "./TopNav";
import { CurrentUser } from "../../features/user/types";
import { useAppDispatch } from "../../store/store";
import { logoutUser } from "../../features/user/operations";

const getInitials = (user: CurrentUser) => {
	const { firstName, lastName } = user;
	const first = firstName.slice(0, 1);
	const last = lastName.slice(0, 1);
	const initials = first + last;

	return initials || "EG";
};

const fakeUser: CurrentUser = {
	userID: "XXX-XXX-XXXXX",
	username: "estengrove99@gmail.com",
	password: "1234",
	firstName: "Steven",
	lastName: "Gore",
	userAvatar: null,
	isActive: true,
	createdDate: new Date().toString(),
	lastLoginDate: new Date().toString(),
	token: null,
};

const AppLayout = () => {
	const currentUser = fakeUser;
	const navigate = useNavigate();
	const dispatch = useAppDispatch();

	const handleLogout = () => {
		const { userID } = currentUser;
		dispatch(logoutUser(userID));
		navigate("/login");
		console.log("LOGGING OUT USER:", userID);
	};

	return (
		<div className={styles.AppLayout}>
			<TopNav currentUser={currentUser} onLogout={handleLogout} />
			<Navbar />
			<Outlet />
		</div>
	);
};

export default AppLayout;
