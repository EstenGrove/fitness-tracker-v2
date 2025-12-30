const saveToLocalStorage = (key: string, data: JsonValue) => {
	const value: string = JSON.stringify(data);

	localStorage.setItem(key, value);
};

const getFromLocalStorage = (key: string) => {
	const valueStr = localStorage.getItem(key);
	if (valueStr) {
		return JSON.parse(valueStr);
	} else {
		return null;
	}
};

const removeFromLocalStorage = (key: string) => {
	localStorage.removeItem(key);
};

const saveToSessionStorage = (key: string, data: JsonValue) => {
	const value: string = JSON.stringify(data);

	sessionStorage.setItem(key, value);
};

const getFromSessionStorage = (key: string) => {
	const valueStr = sessionStorage.getItem(key);
	if (valueStr) {
		return JSON.parse(valueStr);
	} else {
		return null;
	}
};

const removeFromSessionStorage = (key: string) => {
	sessionStorage.removeItem(key);
};

export type JsonValue<TExtra = never> =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue }
	| TExtra;

export interface BrowserStorage<TExtra = never> {
	get: <T = JsonValue<TExtra>>(key: string) => T | null;

	set: (key: string, data: JsonValue<TExtra>) => void;

	remove: (key: string) => void;
	clear: () => void;

	getAll: () => Record<string, JsonValue<TExtra>>;
}

class LocalStorage<TExtra = never> implements BrowserStorage<TExtra> {
	get<T = JsonValue<TExtra>>(key: string): T | null {
		return getFromLocalStorage(key) as T | null;
	}

	set(key: string, data: JsonValue<TExtra>): void {
		saveToLocalStorage(key, data as unknown as JsonValue);
	}

	remove(key: string): void {
		removeFromLocalStorage(key);
	}

	clear(): void {
		localStorage.clear();
	}

	getAll(): Record<string, JsonValue<TExtra>> {
		return { ...localStorage } as Record<string, JsonValue<TExtra>>;
	}
}

class SessionStorage<TExtra = never> implements BrowserStorage<TExtra> {
	get<T = JsonValue<TExtra>>(key: string): T | null {
		return getFromSessionStorage(key) as T | null;
	}

	set(key: string, data: JsonValue<TExtra>): void {
		saveToSessionStorage(key, data as unknown as JsonValue);
	}

	remove(key: string): void {
		removeFromSessionStorage(key);
	}

	clear(): void {
		sessionStorage.clear();
	}

	getAll(): Record<string, JsonValue<TExtra>> {
		return { ...sessionStorage } as Record<string, JsonValue<TExtra>>;
	}
}

export {
	saveToLocalStorage,
	getFromLocalStorage,
	removeFromLocalStorage,
	LocalStorage,
	// Session
	saveToSessionStorage,
	getFromSessionStorage,
	removeFromSessionStorage,
	SessionStorage,
};
