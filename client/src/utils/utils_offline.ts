const isOnline = () => {
	return navigator.onLine;
};

const isOffline = () => {
	return !navigator.onLine;
};

export { isOnline, isOffline };
