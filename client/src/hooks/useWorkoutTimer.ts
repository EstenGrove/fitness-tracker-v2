import { useState } from "react";
import { formatDateTime } from "../utils/utils_dates";
import { useTimer } from "./useTimer";

export type ActiveStatus = "IDLE" | "ACTIVE" | "PAUSED" | "ENDED";

export enum EActiveStatus {
	IDLE = "IDLE",
	ACTIVE = "ACTIVE",
	PAUSED = "PAUSED",
	ENDED = "ENDED",
	COUNTING = "COUNTING",
}

export interface TimeInfo {
	startedAt: string | null;
	pausedAt: string | null;
	resumedAt: string | null;
	endedAt: string | null;
}
export interface TimeInfoAndTotal extends TimeInfo {
	totalTime: string | null;
}

interface HookParams {
	onStart?: (info: TimeInfo) => void;
	onPause?: (info: TimeInfo) => void;
	onResume?: (info: TimeInfo) => void;
	onEnd?: (info: TimeInfoAndTotal) => void;
	onReset?: () => void;
}

const getTimestamp = () => {
	const time = formatDateTime(new Date(), "longMs");

	return time;
};

const defaultOpts: HookParams = {
	onStart() {},
	onPause() {},
	onResume() {},
	onEnd() {},
};

const useWorkoutTimer = (params: HookParams = defaultOpts) => {
	const timer = useTimer();
	const { onStart, onPause, onResume, onEnd } = params;
	const [status, setStatus] = useState<ActiveStatus>(EActiveStatus.IDLE);
	const [timeInfo, setTimeInfo] = useState<TimeInfo>({
		startedAt: null,
		pausedAt: null,
		resumedAt: null,
		endedAt: null,
	});

	const start = () => {
		const time = getTimestamp();
		const info: TimeInfo = { ...timeInfo, startedAt: time };
		timer.start();

		setStatus(EActiveStatus.ACTIVE);
		setTimeInfo(info);

		return onStart && onStart(info);
	};
	const pause = () => {
		const time = getTimestamp();
		const info: TimeInfo = { ...timeInfo, pausedAt: time };
		timer.pause();

		setStatus(EActiveStatus.PAUSED);
		setTimeInfo(info);

		return onPause && onPause(info);
	};
	const resume = () => {
		const time = getTimestamp();
		const info: TimeInfo = { ...timeInfo, resumedAt: time };
		timer.resume();

		setStatus(EActiveStatus.ACTIVE);
		setTimeInfo(info);

		return onResume && onResume(info);
	};
	const end = () => {
		const time = getTimestamp();
		const info: TimeInfo = { ...timeInfo, endedAt: time };
		timer.stop();

		setStatus(EActiveStatus.ENDED);
		setTimeInfo(info);

		console.log("info(hook):", info);
		return onEnd && onEnd({ ...info, totalTime: timer.time });
	};

	return {
		status,
		time: timer.time,
		info: timeInfo,
		start,
		pause,
		resume,
		end,
	};
};

export { useWorkoutTimer };
