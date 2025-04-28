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
import { useCallback, useEffect } from "react";
import { AuthRefreshResponse } from "../../utils/utils_user";

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

		if (logoutData || !logoutData) {
			navigate("/login");
		} else {
			throw new Error("Logout action failed!!!");
		}
	};

	const checkAndRefreshAuth = useCallback(() => {
		dispatch(refreshAuth())
			.unwrap()
			.then((resp: AuthRefreshResponse) => {
				if (!resp.token) {
					navigate("/login");
				}
			})
			.catch((err) => {
				if (err) {
					navigate("/login");
				}
			});
	}, [dispatch, navigate]);

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (!currentUser) {
			checkAndRefreshAuth();
		}

		return () => {
			isMounted = false;
		};
	}, [checkAndRefreshAuth, currentUser]);

	return (
		<div className={styles.AppLayout}>
			<TopNav onLogout={handleLogout} />
			<Navbar />
			<Outlet />
		</div>
	);
};

export default AppLayout;
