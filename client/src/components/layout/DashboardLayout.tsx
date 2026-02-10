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
import { useCallback, useEffect, useState } from "react";
import { AuthRefreshResponse } from "../../utils/utils_user";
import { setAccessTokenCookie } from "../../utils/utils_cookies";
import { useResumeActiveWorkout } from "../../hooks/useResumeActiveWorkouts";
import { ActiveWorkoutInfo } from "../../utils/utils_workouts";
import WorkoutIsland from "./WorkoutIsland";

const ENABLE_WORKOUT_ISLAND = false;

const AppLayout = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const currentSession = useSelector(selectCurrentSession);
	const { activeWorkout, resume } = useResumeActiveWorkout();
	const [showActiveWorkoutIndicator, setShowActiveWorkoutIndicator] =
		useState<boolean>(!!activeWorkout || false);

	const onResumeWorkout = () => {
		setShowActiveWorkoutIndicator(false);
		resume();
	};
	const onPauseWorkout = () => {
		setShowActiveWorkoutIndicator(false);
		resume();
	};
	const onDismissWorkout = () => {
		setShowActiveWorkoutIndicator(false);
	};

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
		const userID = currentUser?.userID ?? "";
		const sessionID = currentSession?.sessionID ?? "";
		dispatch(refreshAuth())
			.unwrap()
			.then((resp: AuthRefreshResponse) => {
				if (!resp.token) {
					dispatch(logoutUser({ userID, sessionID }));
					navigate("/login");
				} else {
					const token = resp.token as string;
					setAccessTokenCookie(token);
				}
			})
			.catch((err) => {
				if (err) {
					dispatch(logoutUser({ userID, sessionID }));
					navigate("/login");
				}
			});
	}, [currentSession?.sessionID, currentUser?.userID, dispatch, navigate]);

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
			{showActiveWorkoutIndicator && ENABLE_WORKOUT_ISLAND && (
				<WorkoutIsland
					workout={activeWorkout as ActiveWorkoutInfo}
					onResume={onResumeWorkout}
					onPause={onPauseWorkout}
					onDismiss={onDismissWorkout}
				/>
			)}
		</div>
	);
};

export default AppLayout;
