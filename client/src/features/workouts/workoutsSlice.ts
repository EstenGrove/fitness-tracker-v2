import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ETStatus, TStatus } from "../types";
import {
	TodaysWorkout,
	Workout,
	WorkoutByType,
	WorkoutDetails,
	WorkoutSchedule,
} from "./types";
import { RootState } from "../../store/store";
import { HistoryOfType } from "../history/types";
import { getWorkoutDetails } from "./operations";

export interface WorkoutsSlice {
	status: TStatus;
	workouts: Workout[];
	selected: SelectedWorkoutDetails | null;
	active: TodaysWorkout | null;
}

interface SelectedWorkoutDetails {
	workout: WorkoutByType;
	schedule: WorkoutSchedule;
	history: HistoryOfType[];
}

const initialState: WorkoutsSlice = {
	status: ETStatus.IDLE,
	workouts: [],
	selected: null,
	active: null,
};

const workoutsSlice = createSlice({
	name: "workouts",
	initialState: initialState,
	reducers: {
		setActiveWorkout(
			state: WorkoutsSlice,
			action: PayloadAction<TodaysWorkout>
		) {
			state.active = action.payload;
		},
	},
	extraReducers(builder) {
		builder.addCase(getWorkoutDetails.pending, (state) => {
			state.status = ETStatus.PENDING;
		});
		builder.addCase(
			getWorkoutDetails.fulfilled,
			(state, action: PayloadAction<WorkoutDetails>) => {
				state.status = ETStatus.FULFILLED;
				state.selected = action.payload;
			}
		);
	},
});

export const { setActiveWorkout } = workoutsSlice.actions;

export const selectIsLoadingWorkout = (state: RootState) => {
	return state.workouts.status === ETStatus.PENDING;
};
export const selectActiveWorkout = (state: RootState) => {
	return state.workouts.active as TodaysWorkout;
};
export const selectSelectedWorkout = (state: RootState) => {
	return state.workouts.selected as SelectedWorkoutDetails;
};

export default workoutsSlice.reducer;
