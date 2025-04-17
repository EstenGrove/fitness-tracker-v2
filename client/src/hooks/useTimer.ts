import { useState, useEffect, useRef, useMemo } from "react";

export interface IMinsAndSecs {
	minutes: number;
	seconds: number;
}
const timerToMinsAndSecs = (timer: number): IMinsAndSecs => {
	const mins = Math.floor(timer / 60);
	const secs = timer - mins * 60;

	return {
		minutes: mins,
		seconds: secs,
	};
};

export interface ITimerProps {
	startTime?: number;
	step?: number;
	interval?: number;
}

const defaultOpts = {
	startTime: 0,
	step: 1,
	interval: 1000,
};

const useTimer = ({
	startTime = 0,
	step = 1,
	interval = 1000,
}: ITimerProps = defaultOpts) => {
	const [isActive, setIsActive] = useState<boolean>(false);
	const [timerValue, setTimerValue] = useState<number>(startTime);
	const timerID = useRef<ReturnType<typeof setInterval> | null>(null);
	// formatted time
	const formattedTime = useMemo(() => {
		// format the timerValue => '0:01'
		const { minutes, seconds } = timerToMinsAndSecs(timerValue);
		const secs = seconds < 10 ? `0${seconds}` : seconds;
		const newTime = `${minutes}:${secs}`;

		return newTime;
	}, [timerValue]);

	const startTimer = () => {
		setIsActive(true);
	};
	const resumeTimer = () => {
		setIsActive(true);
	};
	const pauseTimer = () => {
		// keep interval timerID
		setIsActive(false);
	};
	const stopTimer = () => {
		// clear timerID
		if (timerID.current) {
			clearInterval(timerID.current);
		}

		setIsActive(false);
	};

	const resetTimer = () => {
		// clear timerID
		if (timerID.current) {
			clearInterval(timerID.current);
		}

		setIsActive(false);
		setTimerValue(startTime);
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) {
			return;
		}

		if (isActive) {
			timerID.current = setInterval(() => {
				const newTime = timerValue + step;
				setTimerValue(newTime);
			}, interval);
		}

		return () => {
			isMounted = false;
			const id = timerID.current;
			if (id) {
				clearInterval(id);
			}
		};
	}, [interval, isActive, step, timerValue]);

	return {
		time: formattedTime,
		timer: timerValue,
		start: startTimer,
		stop: stopTimer,
		pause: pauseTimer,
		reset: resetTimer,
		resume: resumeTimer,
	};
};

export { useTimer };
