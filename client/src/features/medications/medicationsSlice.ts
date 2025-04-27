import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { formatDate } from "../../utils/utils_dates";
import { DateRange, ETStatus, TStatus } from "../types";
import { Medication, MedLogEntry, SelectedMed, SummaryForDate } from "./types";
import { RootState } from "../../store/store";
import { getMedLogsByRange, logMedication } from "./operations";

interface MedicationsSlice {
	status: TStatus;
	meds: Medication[];
	logs: MedLogEntry[];
	selectedMed: SelectedMed | null;
	summaryForDate: SummaryForDate;
}

const initialState: MedicationsSlice = {
	status: ETStatus.IDLE,
	meds: [],
	logs: [],
	summaryForDate: {
		date: formatDate(new Date().toString(), "long"),
		summaries: [],
		logs: [], // logs for selected date
	},
	selectedMed: null,
};

const medicationsSlice = createSlice({
	name: "medications",
	initialState: initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(logMedication.pending, (state: MedicationsSlice) => {
				state.status = ETStatus.IDLE;
			})
			.addCase(
				logMedication.fulfilled,
				(state, action: PayloadAction<{ newLog: MedLogEntry }>) => {
					state.status = ETStatus.FULFILLED;
					state.logs = [action.payload.newLog, ...state.logs];
				}
			);

		builder
			.addCase(getMedLogsByRange.pending, (state: MedicationsSlice) => {
				state.status = ETStatus.IDLE;
			})
			.addCase(
				getMedLogsByRange.fulfilled,
				(
					state: MedicationsSlice,
					action: PayloadAction<{ logs: MedLogEntry[]; range: DateRange }>
				) => {
					state.status = ETStatus.FULFILLED;
					state.logs = action.payload.logs;
				}
			);
	},
});

export const selectIsMedLoading = (state: RootState) => {
	return state.medications.status === ETStatus.IDLE;
};
export const selectMedSummary = (state: RootState) => {
	return state.medications.summaryForDate as SummaryForDate;
};
export const selectAllMedLogs = (state: RootState) => {
	return state.medications.logs;
};
export const selectAllMeds = (state: RootState) => {
	return state.medications.meds;
};
export const selectSelectedMed = (state: RootState) => {
	return state.medications.selectedMed;
};

export default medicationsSlice.reducer;
