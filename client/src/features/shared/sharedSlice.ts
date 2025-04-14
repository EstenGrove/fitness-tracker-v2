import { createSlice } from "@reduxjs/toolkit";
import { TStatus } from "../types";
import { ActivityType } from "./types";

export interface SharedSlice {
	status: TStatus;
	activityTypes: ActivityType[];
}

const initialState: SharedSlice = {
	status: "IDLE",
	activityTypes: [],
};

const sharedSlice = createSlice({
	name: "shared",
	initialState: initialState,
	reducers: {},
});

export default sharedSlice.reducer;
