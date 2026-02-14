import React, { createContext, useState, useCallback, useEffect } from "react";
import {
	usePersistentTimer,
	TimerStatus,
	TimeInfo,
	getPersistedInfo,
} from "../hooks/usePersistentTimer";

export interface WorkoutContextType {
	// State
	timer: number;
	status: TimerStatus;
	timeInfo: TimeInfo | null;

	// Actions
	start: (duration: number) => void;
	pause: () => void;
	resume: () => void;
	end: () => void;
	reset: (duration: number) => void;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);
const WorkoutContextProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [duration, setDuration] = useState(1);
	// Store the final timeInfo before reset clears it
	const [finalTimeInfo, setFinalTimeInfo] = useState<TimeInfo | null>(null);

	const timerHook = usePersistentTimer(duration, {
		onStart(info) {
			console.log(`[STARTED] ${info.startedAt}`);
		},
		onEnd(info) {
			console.log(`[ENDED] ${info.endedAt}`);
			setFinalTimeInfo(info);
			setTimeInfo(info);
		},
	});

	// Sync timeInfo from localStorage
	const [timeInfo, setTimeInfo] = useState<TimeInfo | null>(() =>
		getPersistedInfo()
	);

	useEffect(() => {
		const interval = setInterval(() => {
			const info = getPersistedInfo();
			if (info) {
				setTimeInfo(info);
			} else {
				// If localStorage is cleared (after reset), use finalTimeInfo if available
				if (finalTimeInfo && timerHook.status === "IDLE") {
					setTimeInfo(finalTimeInfo);
				} else {
					setTimeInfo(null);
				}
			}
		}, 100); // Quick sync check

		return () => clearInterval(interval);
	}, [timerHook.status, finalTimeInfo]);

	const start = useCallback(
		(dur: number) => {
			setDuration(dur);
			// Use setTimeout to ensure duration state is updated before start
			// This ensures the hook uses the correct duration
			setTimeout(() => {
				timerHook.start();
			}, 0);
		},
		[timerHook]
	);

	const reset = useCallback((dur: number) => {
		setDuration(dur);
		// Don't clear finalTimeInfo immediately - let it be used by sync interval
		// It will be cleared when timer starts again
	}, []);

	// Clear finalTimeInfo when timer starts again
	useEffect(() => {
		if (timerHook.status === "ACTIVE" && finalTimeInfo) {
			setFinalTimeInfo(null);
		}
	}, [timerHook.status, finalTimeInfo]);

	// When duration changes and timer is IDLE, reset the timer with new duration
	useEffect(() => {
		if (timerHook.status === "IDLE" && duration !== 1) {
			// The hook will use the current duration prop value
			timerHook.reset();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [duration]); // Only when duration changes

	const value: WorkoutContextType = {
		timer: timerHook.timer,
		status: timerHook.status,
		timeInfo,
		start,
		pause: timerHook.pause,
		resume: timerHook.resume,
		end: timerHook.end,
		reset,
	};

	return (
		<WorkoutContext.Provider value={value}>{children}</WorkoutContext.Provider>
	);
};

export { WorkoutContextProvider, WorkoutContext };
