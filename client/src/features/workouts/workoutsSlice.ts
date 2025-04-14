import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { Workout } from "./types";

export interface WorkoutsSlice {
	status: TStatus;
	workouts: Workout[];
}

const initialState: WorkoutsSlice = {
	status: "IDLE",
	workouts: [],
};

const workoutsSlice = createSlice({
	name: "workouts",
	initialState: initialState,
	reducers: {},
});

export default workoutsSlice.reducer;
