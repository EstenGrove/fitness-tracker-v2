import { useSearchParams } from "react-router";

export type ParamsObj = Record<
	string,
	string | number | boolean | null | undefined
>;
export type ParamValOrVals = Record<string, string> | string;

const useQueryParams = () => {
	const [params, setParams] = useSearchParams();

	const set = (values: ParamsObj) => {
		setParams({ ...params, ...values });
	};
	const get = (key?: string): ParamValOrVals => {
		if (!key) {
			const all = Object.fromEntries([...params]);
			return all;
		} else {
			return params.get(key) as string;
		}
	};

	const clear = (key?: string) => {
		if (!key) {
			setParams({});
		} else {
			const newParams = { ...params };
			delete newParams[key as keyof object];
			setParams(newParams);
		}
	};

	return {
		params,
		getParams: get,
		setParams: set,
		clearParams: clear,
	};
};

export { useQueryParams };
