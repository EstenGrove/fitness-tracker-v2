import { Outlet, useNavigate } from "react-router";
import styles from "../../css/layout/DashboardLayout.module.scss";
import Navbar from "./Navbar";
import TopNav from "./TopNav";
import { useAppDispatch } from "../../store/store";
import { logoutUser, refreshAuth } from "../../features/user/operations";
import { useSelector } from "react-redux";
import {
	selectCurrentSession,
	selectCurrentUser,
} from "../../features/user/userSlice";
import { useEffect } from "react";

const AppLayout = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const currentSession = useSelector(selectCurrentSession);

	const handleLogout = async () => {
		const userID = currentUser?.userID ?? "";
		const sessionID = currentSession?.sessionID ?? "";
		const logoutData = await dispatch(
			logoutUser({ userID, sessionID })
		).unwrap();

		console.log("logoutData", logoutData);

		if (logoutData || !logoutData) {
			navigate("/login");
		} else {
			throw new Error("Logout action failed!!!");
		}
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!currentUser) {
			dispatch(refreshAuth());
		}

		return () => {
			isMounted = false;
		};
	}, [currentUser, dispatch]);

	return (
		<div className={styles.AppLayout}>
			<TopNav onLogout={handleLogout} />
			<Navbar />
			<Outlet />
		</div>
	);
};

export default AppLayout;
