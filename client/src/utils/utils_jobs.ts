const statusMsgs = {
	success: (count: number, total: number) => {
		return count + ` jobs were completed successfully ${count}/${total}`;
	},
	failed: (count: number, total: number) => {
		return count + ` jobs failed out of ${total} (${count}/${total})`;
	},
	skipped: (count: number, total: number) => {
		return count + ` jobs were skipped out of ${total} (${count}/${total})`;
	},
};

export { statusMsgs };
