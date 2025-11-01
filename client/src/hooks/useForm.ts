import { useState } from "react";

const valueIsDiff = <T extends object>(
	name: string,
	newVal: string | number | Date | boolean,
	initialVals: T
): boolean => {
	const original = initialVals[name as keyof T];

	return original !== newVal;
};

type DirtyValues<T extends object> = {
	[K in keyof T]: boolean;
};

const getInitialDirty = <T extends object>(values: T) => {
	if (!values) return {} as DirtyValues<T>;
	return Object.keys(values).reduce((all, key) => {
		all[key as keyof T] = false;
		return all;
	}, {} as DirtyValues<T>);
};

const useForm = <T extends object>(initialVals: T) => {
	const [values, setValues] = useState<T>(initialVals);
	const [dirtyValues, setDirtyValues] = useState<DirtyValues<T>>(
		getInitialDirty(initialVals)
	);
	const [hasChanges, setHasChanges] = useState<boolean>(false);

	const updateDirtyStates = (
		name: string,
		value: string | number | Date | boolean
	) => {
		const isDiff = valueIsDiff(name, value, initialVals);
		setHasChanges(isDiff || hasChanges);
		setDirtyValues({ ...dirtyValues, [name]: isDiff });
	};

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});

		updateDirtyStates(name, value);
	};

	const onCheckbox = (name: string, value: boolean) => {
		setValues({
			...values,
			[name]: value,
		});
		updateDirtyStates(name, value);
	};

	const onSelect = (name: string, value: string | Date) => {
		setValues({
			...values,
			[name]: value,
		});
		updateDirtyStates(name, value);
	};

	return {
		hasChanges: hasChanges,
		dirty: dirtyValues,
		values: values,
		onChange: onChange,
		onCheckbox: onCheckbox,
		onSelect: onSelect,
	};
};

export { useForm };
