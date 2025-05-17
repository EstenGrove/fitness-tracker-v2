import { useEffect, useState } from "react";
import {
	JsonValue,
	LocalStorage,
	SessionStorage,
} from "../utils/utils_storage";

export type StorageType = "LOCAL" | "SESSION";

export interface FormOptions {
	storageType?: StorageType;
	expiry?: number; // mins
}

const defaultOpts: FormOptions = {
	storageType: "SESSION",
};

const storageLocal = new LocalStorage();
const storageSession = new SessionStorage();

const usePersistentForm = <T>(
	formKey: string,
	initialValue: T,
	options: FormOptions = defaultOpts
) => {
	const cache = options.storageType === "LOCAL" ? storageLocal : storageSession;
	const [state, setState] = useState<T>(getInitialValue);

	function getInitialValue() {
		const stored = cache.get(formKey) as T;
		if (!stored) {
			return initialValue;
		} else {
			return stored;
		}
	}

	const clear = () => {
		cache.remove(formKey);
		setState(initialValue);
	};

	useEffect(() => {
		let isMounted = true;
		if (!isMounted) return;

		cache.set(formKey, state as JsonValue);

		return () => {
			isMounted = false;
		};
	}, [cache, formKey, state]);

	return [state, setState, clear];
};

export { usePersistentForm };
