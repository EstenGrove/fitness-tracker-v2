import { createContext, useState } from "react";
import {
	TimeInfo,
	TimerStatus,
	usePersistentTimer,
} from "../hooks/usePersistentTimer";
import { Activity } from "../features/shared/types";

export interface WorkoutTimerState {
	timer: number; // The current timer value in seconds (eg. 15, 30, 45, 60)
	status: TimerStatus; // The current status of the timer (eg. IDLE, ACTIVE, PAUSED, STOPPED, ENDED, COUNTDOWN)
	duration: number; // Duration/interval in mins for the workout (eg. 15, 30, 45, 60)
	start: () => void;
	end: (info: TimeInfo) => void;
	pause: () => void;
	resume: () => void;
	reset: () => void;
}

export interface WorkoutInfo {
	workoutID: string;
	workoutName: string;
	workoutDuration: number;
	activityType: Activity;
}

export interface WorkoutContextState {
	workoutInfo: WorkoutInfo | null;
	workoutTimer: WorkoutTimerState;
	initialDuration: number;
	setDuration: (duration: number) => void;
}

const defaultState: WorkoutContextState = {
	initialDuration: 0,
	workoutInfo: null,
	workoutTimer: {
		timer: 0,
		status: "IDLE",
		duration: 0,
		start: () => {},
		end: () => {},
		pause: () => {},
		resume: () => {},
		reset: () => {},
	},
	setDuration: () => {},
};

const WorkoutContext = createContext<WorkoutContextState>(defaultState);

const WorkoutContextProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [state, setState] = useState<WorkoutContextState>(defaultState);
	const timer = usePersistentTimer(state.initialDuration, {
		onStart: (info) => {
			setState({
				...state,
				workoutTimer: {
					...state.workoutTimer,
					status: info.status,
					timer: info.intervalInSecs,
					duration: state.initialDuration,
				},
			});
		},
		onEnd: (info) => {
			setState({
				...state,
				workoutTimer: {
					...state.workoutTimer,
					status: info.status,
					timer: info.intervalInSecs,
					duration: state.initialDuration,
				},
			});
		},
	});

	// We need to sync the initial duration from props to our context timer
	const setDuration = (duration: number) => {
		setState({
			...state,
			initialDuration: duration,
		});
	};

	const workoutState: WorkoutContextState = {
		workoutTimer: {
			timer: timer.timer,
			status: timer.status,
			duration: state.initialDuration,
			start: timer.start,
			end: timer.end,
			pause: timer.pause,
			resume: timer.resume,
			reset: timer.reset,
		},
		workoutInfo: state.workoutInfo,
		initialDuration: state.initialDuration,
		setDuration: setDuration,
	};

	return (
		<WorkoutContext.Provider value={workoutState}>
			{children}
		</WorkoutContext.Provider>
	);
};

export { WorkoutContext, WorkoutContextProvider };
