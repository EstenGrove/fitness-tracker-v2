import { useEffect, useRef, useState } from "react";
import { JsonValue, LocalStorage } from "../utils/utils_storage";
import { formatDateTime } from "../utils/utils_dates";

export type TimerMode = "COUNTDOWN" | "TIMER" | "ELAPSED" | "IDLE";

export enum ETimerMode {
	COUNTDOWN = "COUNTDOWN",
	TIMER = "TIMER",
	ELAPSED = "ELAPSED",
	IDLE = "IDLE",
}

export type TimerStatus =
	| "ACTIVE"
	| "PAUSED"
	| "STOPPED"
	| "IDLE"
	| "ENDED"
	| "COUNTDOWN";

export enum ETimerStatus {
	IDLE = "IDLE",
	ACTIVE = "ACTIVE",
	PAUSED = "PAUSED",
	STOPPED = "STOPPED",
	ENDED = "ENDED",
	COUNTDOWN = "COUNTDOWN",
}

const minsToSecs = (mins: number) => {
	return mins * 60;
};

const key = "TIMER_KEY";
const storage = new LocalStorage();

const getElapsed = (now: number, start: number) => {
	return (now - start) / 1000;
};

const getNows = () => {
	const timestamp = Date.now();
	const timeStr = formatDateTime(new Date(), "longMs");

	return {
		startTime: timeStr, // 4533515
		startedAt: timestamp, // 2025-05-10 07:39:42
	};
};

export type NonNullTimeInfo = {
	[K in keyof TimeInfo as null extends TimeInfo[K] ? never : K]: TimeInfo[K];
};

export interface TimeInfo {
	startedAt: number;
	startTime: string;
	status: TimerStatus;
	intervalInSecs: number;
	endedAt: number | null;
	endTime: string | null;
	pausedAt: number | null;
	pauseTime: string | null;
	resumedAt: number | null;
	resumeTime: string | null;
}

export const getPersistedInfo = (key: string = "TIMER_KEY") => {
	const cache = storage.get(key) as TimeInfo | undefined;

	if (cache) {
		return cache;
	} else {
		return null;
	}
};

const getAdjustedTime = () => {
	const origin = getPersistedInfo();

	if (origin && !!origin.pausedAt) {
		const diff = Date.now() - origin.pausedAt;
		const minusDiff = origin.startedAt - diff;
		return minusDiff;
	} else {
		return Date.now() - (origin?.startedAt as number);
	}
};

interface HookParams {
	onStart?: (info: TimeInfo) => void;
	onEnd?: (info: TimeInfo) => void;
}

const defaultOpts: HookParams = {
	onStart() {},
	onEnd() {},
};

const usePersistentTimer = (
	durInMins: number,
	params: HookParams = defaultOpts
) => {
	const { onStart, onEnd } = params;
	const storedInfo = getPersistedInfo();
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const [timer, setTimer] = useState(minsToSecs(durInMins));
	const [mode, setMode] = useState<TimerMode>(ETimerMode.TIMER);
	const [status, setStatus] = useState<TimerStatus>(
		storedInfo?.status ?? ETimerStatus.IDLE
	);
	const isActive = status === ETimerStatus.ACTIVE;

	const start = () => {
		const now = Date.now();
		const { startTime, startedAt } = getNows();
		const existing = getPersistedInfo();

		if (existing?.status === ETimerStatus.PAUSED) {
			setStatus(ETimerStatus.PAUSED);
			return;
		}

		// Restore state, if 'ACTIVE' timer exists
		if (existing) {
			const { startedAt, intervalInSecs } = existing;
			const elapsed = getElapsed(now, startedAt);
			if (elapsed < intervalInSecs) {
				// still in countdown mode
				setMode(ETimerMode.TIMER);
				setTimer(intervalInSecs - elapsed);
			} else {
				// countdown is over; now in count-up (elapsed)
				setMode(ETimerMode.ELAPSED);
				setTimer(elapsed); // total time since start
			}
			setStatus(existing.status);

			return onStart && onStart(existing);
		} else {
			// New timer
			const info: TimeInfo = {
				startedAt,
				startTime,
				endedAt: null,
				endTime: null,
				pausedAt: null,
				pauseTime: null,
				resumedAt: null,
				resumeTime: null,
				status: ETimerStatus.ACTIVE,
				intervalInSecs: minsToSecs(durInMins),
			};
			storage.set(key, info as unknown as JsonValue);
			setStatus(ETimerStatus.ACTIVE);
			setMode(ETimerMode.TIMER);
			setTimer(minsToSecs(durInMins));

			return onStart && onStart(info);
		}
	};

	const stop = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
		}
		setStatus(ETimerStatus.STOPPED);

		const info = getPersistedInfo() as TimeInfo;
		const { startedAt, startTime } = getNows();
		const newInfo: TimeInfo = {
			...info,
			endedAt: startedAt,
			endTime: startTime,
		};
		return onEnd && onEnd(newInfo);
	};

	const pause = () => {
		if (timerRef.current) clearInterval(timerRef.current);
		const { startedAt, startTime } = getNows();
		const origin = getPersistedInfo() as TimeInfo;
		const info: TimeInfo = {
			...origin,
			status: ETimerStatus.PAUSED,
			pausedAt: startedAt,
			pauseTime: startTime,
			intervalInSecs: timer,
		};
		setStatus(ETimerStatus.PAUSED);
		storage.set(key, info as unknown as JsonValue);
	};

	const resume = () => {
		const { startedAt, startTime } = getNows();
		const origin = getPersistedInfo() as TimeInfo;
		const info: TimeInfo = {
			...origin,
			status: ETimerStatus.ACTIVE,
			resumedAt: startedAt,
			resumeTime: startTime,
			intervalInSecs: timer,
		};
		const adjusted = getAdjustedTime();
		console.log("[ADJUSTED]:", adjusted);
		setTimer(timer);
		setStatus(ETimerStatus.ACTIVE);
		storage.set(key, info as unknown as JsonValue);
	};

	const end = () => {
		stop();
		reset();
	};

	const reset = () => {
		storage.remove(key);
		setStatus(ETimerStatus.IDLE);
		setMode(ETimerMode.TIMER);
		setTimer(minsToSecs(durInMins));
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		if (isActive) {
			timerRef.current = setInterval(() => {
				// NORMAL INTERVAL COUNTER (eg. 10, 9, 8)
				if (mode === ETimerMode.TIMER) {
					const newTime = timer - 1;
					// Interval has ended, start counting up (elapsed)
					if (newTime <= 0) {
						setMode(ETimerMode.ELAPSED);
						setTimer(minsToSecs(durInMins) + 1);
					} else {
						setTimer(newTime);
					}
				}

				// ELAPSED TIMER (eg. 8, 9, 10 etc.)
				if (mode === ETimerMode.ELAPSED) {
					const newTime = timer + 1;
					setTimer(newTime);
				}
			}, 1000);
		}

		return () => {
			isMounted = false;
			const id = timerRef.current;
			if (id) {
				clearInterval(id);
			}
		};
	}, [durInMins, isActive, mode, timer]);

	useEffect(() => {
		const info = getPersistedInfo();
		if (info && info.status === ETimerStatus.ACTIVE) {
			start();
		}
		if (info && info.status === ETimerStatus.PAUSED) {
			const initialInterval = minsToSecs(durInMins);
			setTimer(info.intervalInSecs);
			setMode(
				info.intervalInSecs > initialInterval
					? ETimerMode.ELAPSED
					: ETimerMode.TIMER
			);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		timer: timer,
		status: status,
		start: start,
		stop: stop,
		pause: pause,
		resume: resume,
		end: end,
		reset: reset,
	};
};

export { usePersistentTimer };
