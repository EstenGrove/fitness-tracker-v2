import type { TotalTime, TotalTimeDB } from "./types.ts";

const normalizeTotalMins = (mins: TotalTimeDB): TotalTime => {
	const newMins: TotalTime = {
		startDate: mins.start_date,
		endDate: mins.end_date,
		totalMins: mins.total_mins,
	};

	return newMins;
};

export { normalizeTotalMins };
