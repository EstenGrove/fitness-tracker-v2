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

export type JsonValue =
	| string
	| number
	| boolean
	| null
	| JsonValue[]
	| { [key: string]: JsonValue };

export interface BrowserStorage {
	get: (key: string) => unknown;
	set: (
		key: string,
		data: JsonValue
		// data: object | number | Array<unknown> | string | null
	) => void;
	remove: (key: string) => void;
	clear: () => void;
	getAll: () => Record<string, unknown>;
}

class LocalStorage implements BrowserStorage {
	get(key: string) {
		return getFromLocalStorage(key);
	}
	set(key: string, data: JsonValue) {
		return saveToLocalStorage(key, data as JsonValue);
	}
	remove(key: string) {
		return removeFromLocalStorage(key);
	}
	clear() {
		return localStorage.clear();
	}
	getAll() {
		const items = { ...localStorage };
		return items;
	}
}

class SessionStorage implements BrowserStorage {
	get(key: string) {
		return getFromSessionStorage(key);
	}
	set(key: string, data: JsonValue) {
		return saveToSessionStorage(key, data);
	}
	remove(key: string) {
		return removeFromSessionStorage(key);
	}
	clear() {
		return sessionStorage.clear();
	}
	getAll() {
		const items = { ...sessionStorage };
		return items;
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
