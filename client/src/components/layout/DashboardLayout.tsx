import { Outlet, useNavigate } from "react-router";
import styles from "../../css/layout/DashboardLayout.module.scss";
import Navbar from "./Navbar";
import TopNav from "./TopNav";
import { useAppDispatch } from "../../store/store";
import { logoutUser } from "../../features/user/operations";
import { useSelector } from "react-redux";
import {
	selectCurrentSession,
	selectCurrentUser,
} from "../../features/user/userSlice";

const AppLayout = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const currentSession = useSelector(selectCurrentSession);

	const handleLogout = async () => {
		console.log("CLICKED LOGOUT!!!");
		const { userID } = currentUser;
		const { sessionID } = currentSession;
		const logoutData = await dispatch(
			logoutUser({ userID, sessionID })
		).unwrap();
		if (logoutData) {
			navigate("/login");
			console.log("LOGGING OUT USER:", userID);
		} else {
			throw new Error("Logout action failed!!!");
		}
	};

	return (
		<div className={styles.AppLayout}>
			<TopNav onLogout={handleLogout} />
			<Navbar />
			<Outlet />
		</div>
	);
};

export default AppLayout;
