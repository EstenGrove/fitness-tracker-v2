import { Outlet, useLocation, useNavigate } from "react-router";
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
import {
	ActiveWorkoutInfo,
	pauseActiveWorkout,
	resumeActiveWorkout,
} from "../../utils/utils_workouts";
import WorkoutIsland from "./WorkoutIsland";

const ENABLE_WORKOUT_ISLAND = true;

const AppLayout = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useAppDispatch();
	const currentUser = useSelector(selectCurrentUser);
	const currentSession = useSelector(selectCurrentSession);
	const { activeWorkout, resume } = useResumeActiveWorkout();
	const [wasDismissed, setWasDismissed] = useState(false);
	const [showActiveWorkoutIndicator, setShowActiveWorkoutIndicator] =
		useState<boolean>(!!activeWorkout || false);

	// Navigate to the active workout page
	const onViewWorkout = () => {
		resume();
	};
	// Will set the active workout status to 'ACTIVE'
	const onResumeWorkout = () => {
		setShowActiveWorkoutIndicator(false);
		resumeActiveWorkout();
	};
	// Will set the active workout status to 'PAUSED'
	const onPauseWorkout = () => {
		pauseActiveWorkout();
	};
	// Dismisses & closes the workout island
	const onDismissWorkout = () => {
		setShowActiveWorkoutIndicator(false);
		setWasDismissed(true);
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

	// We want to check of active workouts to show our island indicator, if applicable
	useEffect(() => {
		const isOnWorkoutPage = location.pathname.includes("/active/");
		if (isOnWorkoutPage) {
			setShowActiveWorkoutIndicator(false);
			return;
		}

		if (activeWorkout && !wasDismissed) {
			setShowActiveWorkoutIndicator(true);
			return;
		} else {
			setShowActiveWorkoutIndicator(false);
		}
	}, [activeWorkout, location.pathname, wasDismissed]);

	return (
		<div className={styles.AppLayout}>
			<TopNav onLogout={handleLogout} />
			<Navbar />
			<Outlet />
			{showActiveWorkoutIndicator && !wasDismissed && ENABLE_WORKOUT_ISLAND && (
				<WorkoutIsland
					workout={activeWorkout as ActiveWorkoutInfo}
					onResume={onResumeWorkout}
					onPause={onPauseWorkout}
					onDismiss={onDismissWorkout}
					onViewWorkout={onViewWorkout}
				/>
			)}
		</div>
	);
};

export default AppLayout;
