import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { TodaysWorkout, Workout } from "./types";
import { RootState } from "../../store/store";

export interface WorkoutsSlice {
	status: TStatus;
	workouts: Workout[];
	active: TodaysWorkout | null;
}

const initialState: WorkoutsSlice = {
	status: "IDLE",
	workouts: [],
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
});

export const { setActiveWorkout } = workoutsSlice.actions;

export const selectActiveWorkout = (state: RootState) => {
	return state.workouts.active as TodaysWorkout;
};

export default workoutsSlice.reducer;
