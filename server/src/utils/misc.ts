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
	fn: (item: T) => string | number,
) => {
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

// Math, rounding, averaging utils //

// Get the average of an array of numbers
const average = (values: number[]): number => {
	if (!values.length) return 0;
	const total = values.reduce((sum, value) => sum + value, 0);
	return total / values.length;
};

// Round a number to a specified number of decimal places
const round = (value: number, decimals: number = 1): number => {
	const factor = 10 ** decimals;
	return Math.round(value * factor) / factor;
};

export { sortByDate, sortByDateDesc, groupBy, groupByFn, average, round };
