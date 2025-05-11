import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { DateRange } from "../types";
import { RootState } from "../../store/store";
import { formatDate, getWeekStartAndEnd } from "../../utils/utils_dates";

export interface HistorySlice {
	dateRange: DateRange | null;
}

const { startDate, endDate } = getWeekStartAndEnd();

const initialState: HistorySlice = {
	dateRange: {
		startDate: formatDate(startDate, "long"),
		endDate: formatDate(endDate, "long"),
	},
};

const historySlice = createSlice({
	name: "history",
	initialState: initialState,
	reducers: {
		setDateRange(state: HistorySlice, action: PayloadAction<DateRange>) {
			state.dateRange = action.payload;
		},
	},
});

export const { setDateRange } = historySlice.actions;

export const selectHistoryRange = (state: RootState) => {
	return state.history.dateRange as DateRange;
};

export default historySlice.reducer;
