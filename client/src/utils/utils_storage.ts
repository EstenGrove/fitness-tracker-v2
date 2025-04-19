const saveToLocalStorage = (
	key: string,
	data: object | number | string | null
) => {
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

class LocalStorage {
	get(key: string) {
		return getFromLocalStorage(key);
	}
	set(key: string, data: object | number | Array<unknown> | string | null) {
		return saveToLocalStorage(key, data);
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

export {
	saveToLocalStorage,
	getFromLocalStorage,
	removeFromLocalStorage,
	LocalStorage,
};
