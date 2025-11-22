import { useSelector } from "react-redux";
import { DeferredFetch } from "./useDeferredLogQueue";
import { selectCurrentUser } from "../features/user/userSlice";
import { useRef, useState } from "react";
import { prepareTimestamp } from "../utils/utils_dates";
import { HabitLogValues } from "../features/habits/types";

/**
 * Defers fetch request for habit logging; merges the logs into a single log w/ the totalled value as the 'loggedAmount'
 * @param delay {number} - Delay before fetch should fire after an even
 * @param deferredFetch {DeferredFetch<T>} - A fetch request that's deferred for X seconds/ms
 *
 * NOTE: this is a custom built deferred fetching mechanism that records data triggered by an event (eg. onClick), then waits for X seconds before firing the request. But before it fires, it will merge the data records into a single HabitLogValues record
 */

const createNewLog = (
	userID: string,
	logs: HabitLogValues[]
): HabitLogValues => {
	const sample = logs[0];
	const total = logs.reduce((final, item) => {
		return (final += Number(item.loggedAmount));
	}, 0);

	const newLog = {
		userID: userID,
		habitID: sample.habitID,
		loggedAmount: Number(total),
		loggedAt: prepareTimestamp(new Date()),
		notes: "Habit logged",
	};
	return newLog;
};

const useBatchedHabitLogger = (
	delay: number,
	deferredFetch: DeferredFetch<HabitLogValues>
) => {
	const currentUser = useSelector(selectCurrentUser);
	const [queuedLogs, setQueuedLogs] = useState<HabitLogValues[]>([]);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const queueLog = (log: HabitLogValues) => {
		const newLogs = [...queuedLogs, log];
		setQueuedLogs(newLogs);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			flushQueue(newLogs);
		}, delay);
	};

	const flushQueue = async (logs: HabitLogValues[]) => {
		if (logs && logs.length > 0) {
			const { userID } = currentUser;
			const finalLog = createNewLog(userID, logs);
			await deferredFetch(userID, [finalLog]);
			setQueuedLogs([]);
		}
	};

	return {
		queueLog,
		queuedLogs,
		flushQueue,
	};
};

export { useBatchedHabitLogger };
