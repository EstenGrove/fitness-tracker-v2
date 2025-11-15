const addEllipsis = (str: string, maxLength: number = 30) => {
	if (!str) return "";
	if (str.length <= maxLength) return str;

	return str.slice(0, maxLength - 3) + "...";
};

const isEmptyArray = (arr: Array<unknown>) => {
	if (!arr) return true;

	return Array.isArray(arr) && arr.length <= 0;
};

const isEmptyObj = (obj: object | Record<string, unknown>) => {
	if (!obj) return true;
	return Object.keys(obj).length <= 0;
};

const isEmptyStr = (str: string) => {
	if (!str) return true;
	return str === "" || str.length === 0;
};

const formatThousand = (num: number) => {
	if (num >= 1000) {
		return (num / 1000).toFixed(1).replace(/\.0$/, "") + "k";
	}
	return num.toString();
};

const formatLargeNumber = (num: number) => {
	const short = new Intl.NumberFormat("en-us", {
		notation: "compact",
		compactDisplay: "short",
	});
	return short.format(num);
};

export type TKey<T> = keyof T;
export type TRecord<T> = Record<string, T[]>;
export type Groups<T> = Record<string, T>;

const groupBy = <T extends object>(key: TKey<T>, list: T[]) => {
	const grouped = {} as TRecord<T>;
	for (let i = 0; i < list.length; i++) {
		const item = list[i] as T;
		const mapKey = item[key] as TKey<T>;

		if (!grouped[mapKey as keyof object]) {
			grouped[mapKey as keyof TRecord<T>] = [];
		}
		grouped[mapKey as keyof TRecord<T>].push(item as T);
	}
	return grouped;
};
// Example fn: groupByFn([...someData], (x) => x.name);
const groupByFn = <T extends object>(
	list: T[],
	fn: (item: T) => string | number
) => {
	if (!list || !list.length) return {};
	const grouped = {} as TRecord<T>;

	for (let i = 0; i < list.length; i++) {
		const current = list[i] as T;
		const iteratee = fn(current);

		if (!grouped[iteratee as keyof object]) {
			grouped[iteratee as keyof object] = [];
		}

		grouped[iteratee as keyof object].push(current);
	}

	return grouped;
};

const sortByDate = <T extends object>(key: TKey<T>, list: T[]): T[] => {
	if (!list || !list.length) return [];

	return [...list]?.sort((a, b) => {
		const valA = a[key] as string;
		const valB = b[key] as string;
		const dateA = new Date(valA).getTime();
		const dateB = new Date(valB).getTime();

		return dateB - dateA;
	});
};
const sortByDateDesc = <T extends object>(key: TKey<T>, list: T[]): T[] => {
	if (!list || !list.length) return [];

	return [...list]?.sort((a, b) => {
		const valA = a[key] as string;
		const valB = b[key] as string;
		const dateA = new Date(valA).getTime();
		const dateB = new Date(valB).getTime();

		return dateA - dateB;
	});
};
const provideFallbackStr = (targetVal: string, fallback: string) => {
	if (!targetVal || targetVal === "") return fallback;

	return targetVal;
};

const sortByDateOrder = <T extends object>(
	key: TKey<T>,
	list: T[],
	order: "ASC" | "DESC" = "ASC"
): T[] => {
	if (!list || !list.length) return [];

	switch (order) {
		case "ASC": {
			return sortByDate(key, list);
		}
		case "DESC": {
			return sortByDateDesc(key, list);
		}

		default:
			return sortByDate(key, list);
	}
};

export {
	// Data checkers
	isEmptyStr,
	isEmptyArray,
	isEmptyObj,
	// Format utils
	addEllipsis,
	formatThousand,
	formatLargeNumber,
	groupBy,
	groupByFn,
	sortByDate,
	sortByDateDesc,
	sortByDateOrder,
	provideFallbackStr,
};
