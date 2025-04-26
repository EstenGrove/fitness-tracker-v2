import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Apis
import { historyApi } from "../features/history/historyApi";
import { summaryApi } from "../features/dashboard/summaryApi";
import { medicationsApi } from "../features/medications/medicationsApi";
import { todaysWorkoutsApi } from "../features/workouts/todaysWorkoutsApi";

// Reducers
import userReducer from "../features/user/userSlice";
import sharedReducer from "../features/shared/sharedSlice";
import workoutsReducer from "../features/workouts/workoutsSlice";
import medicationsReducer from "../features/medications/medicationsSlice";
import { recentActivityApi } from "../features/recent-activity/recentActivityApi";

const store = configureStore({
	reducer: {
		user: userReducer,
		shared: sharedReducer,
		workouts: workoutsReducer,
		medications: medicationsReducer,
		[historyApi.reducerPath]: historyApi.reducer,
		[summaryApi.reducerPath]: summaryApi.reducer,
		[medicationsApi.reducerPath]: medicationsApi.reducer,
		[todaysWorkoutsApi.reducerPath]: todaysWorkoutsApi.reducer,
		[recentActivityApi.reducerPath]: recentActivityApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat(todaysWorkoutsApi.middleware)
			.concat(historyApi.middleware)
			.concat(summaryApi.middleware)
			.concat(medicationsApi.middleware)
			.concat(recentActivityApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
