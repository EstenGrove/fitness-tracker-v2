import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Apis
import { todaysWorkoutsApi } from "../features/workouts/todaysWorkoutsApi";
import { historyApi } from "../features/history/historyApi";
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
		[todaysWorkoutsApi.reducerPath]: todaysWorkoutsApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat(todaysWorkoutsApi.middleware)
			.concat(historyApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
