import { useLazyGetHabitHistoryForRangeQuery } from "../features/habits/habitsApi";
import { HabitHistoryByRange } from "../utils/utils_habits";

export interface HistoryByRangeParams {
	habitID: number;
	startDate: string;
	endDate: string;
}

const useHabitHistoryForRangeLazy = () => {
	const [trigger, { data, isLoading }] = useLazyGetHabitHistoryForRangeQuery();
	const rangeHistory = data as HabitHistoryByRange;

	return {
		data: rangeHistory,
		trigger: trigger,
		isLoading: isLoading,
	};
};

export { useHabitHistoryForRangeLazy };
