import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Apis
import { historyApi } from "../features/history/historyApi";
import { summaryApi } from "../features/dashboard/summaryApi";
import { todaysWorkoutsApi } from "../features/workouts/todaysWorkoutsApi";
// Reducers
import userReducer from "../features/user/userSlice";
import sharedReducer from "../features/shared/sharedSlice";
import workoutsReducer from "../features/workouts/workoutsSlice";

const store = configureStore({
	reducer: {
		user: userReducer,
		shared: sharedReducer,
		workouts: workoutsReducer,
		[historyApi.reducerPath]: historyApi.reducer,
		[summaryApi.reducerPath]: summaryApi.reducer,
		[todaysWorkoutsApi.reducerPath]: todaysWorkoutsApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat(todaysWorkoutsApi.middleware)
			.concat(historyApi.middleware)
			.concat(summaryApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
