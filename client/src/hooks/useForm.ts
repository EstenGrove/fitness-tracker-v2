import { useState } from "react";

const valueIsDiff = <T extends object>(
	name: string,
	newVal: string | number | Date | boolean,
	initialVals: T
): boolean => {
	const original = initialVals[name as keyof T];

	return original !== newVal;
};

const useForm = <T extends object>(initialVals: T) => {
	const [values, setValues] = useState<T>(initialVals);
	const [hasChanges, setHasChanges] = useState<boolean>(false);

	const onChange = (name: string, value: string | number) => {
		setValues({
			...values,
			[name]: value,
		});
		const isDiff = valueIsDiff(name, value, initialVals);
		setHasChanges(isDiff || hasChanges);
	};

	const onCheckbox = (name: string, value: boolean) => {
		setValues({
			...values,
			[name]: value,
		});
		const isDiff = valueIsDiff(name, value, initialVals);
		setHasChanges(isDiff || hasChanges);
	};

	const onSelect = (name: string, value: string | Date) => {
		setValues({
			...values,
			[name]: value,
		});
		const isDiff = valueIsDiff(name, value, initialVals);
		setHasChanges(isDiff || hasChanges);
	};

	return {
		hasChanges,
		values,
		onChange,
		onCheckbox,
		onSelect,
	};
};

export { useForm };
