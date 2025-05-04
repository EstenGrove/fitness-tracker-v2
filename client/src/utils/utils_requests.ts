export interface FetchOptions {
	method?: "GET" | "POST" | "PUT" | "DELETE";
	headers?: HeadersInit;
	body?: string;
}

const defaultOpts: FetchOptions = {
	method: "GET",
};

const fetchWithAuth = (url: string, options: FetchOptions = defaultOpts) => {
	return fetch(url, {
		...(options as RequestInit),
		credentials: "include",
	});
};

const sleep = (ms: number = 650) => {
	return new Promise((resolve) => {
		setTimeout(() => {
			resolve(ms);
		}, ms);
	});
};

export { fetchWithAuth, sleep };
