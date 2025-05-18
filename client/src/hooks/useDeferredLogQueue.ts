import { useRef, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";

export type DeferredLog = Record<string, number | string | boolean>;

export type DeferredFetch<T> = (...args: unknown[]) => Promise<T[] | unknown>;

const useDeferredLogQueue = <T extends DeferredLog>(
	delay: number,
	deferredFetch: DeferredFetch<T>
) => {
	const currentUser = useSelector(selectCurrentUser);
	const [queuedLogs, setQueuedLogs] = useState<T[]>([]);
	const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

	const queueLog = (log: T) => {
		const newLogs = [...queuedLogs, log];
		setQueuedLogs(newLogs);

		if (debounceRef.current) {
			clearTimeout(debounceRef.current);
		}

		debounceRef.current = setTimeout(() => {
			flushQueue(newLogs);
		}, delay);
	};

	const flushQueue = async (logs: T[]) => {
		if (logs && logs.length > 0) {
			const { userID } = currentUser;
			await deferredFetch(userID, logs);
			setQueuedLogs([]);
		}
	};

	return {
		queueLog,
		queuedLogs,
		flushQueue,
	};
};

export { useDeferredLogQueue };
