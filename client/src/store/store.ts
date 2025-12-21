import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
// Apis
import { streaksApi } from "../features/streaks/api";
import { statsApi } from "../features/stats/statsApi";
import { settingsApi } from "../features/settings/api";
import { habitsApi } from "../features/habits/habitsApi";
import { historyApi } from "../features/history/historyApi";
import { summaryApi } from "../features/dashboard/summaryApi";
import { customSummaryApi } from "../features/summary/summaryApi";
import { medicationsApi } from "../features/medications/medicationsApi";
import { todaysWorkoutsApi } from "../features/workouts/todaysWorkoutsApi";
import { recentActivityApi } from "../features/recent-activity/recentActivityApi";

// Reducers
import userReducer from "../features/user/userSlice";
import settingsReducer from "../features/settings/slice";
import sharedReducer from "../features/shared/sharedSlice";
import historyReducer from "../features/history/historySlice";
import workoutsReducer from "../features/workouts/workoutsSlice";
import medicationsReducer from "../features/medications/medicationsSlice";

const store = configureStore({
	reducer: {
		user: userReducer,
		shared: sharedReducer,
		history: historyReducer,
		workouts: workoutsReducer,
		settings: settingsReducer,
		medications: medicationsReducer,
		[statsApi.reducerPath]: statsApi.reducer,
		[habitsApi.reducerPath]: habitsApi.reducer,
		[streaksApi.reducerPath]: streaksApi.reducer,
		[historyApi.reducerPath]: historyApi.reducer,
		[summaryApi.reducerPath]: summaryApi.reducer,
		[settingsApi.reducerPath]: settingsApi.reducer,
		[medicationsApi.reducerPath]: medicationsApi.reducer,
		[todaysWorkoutsApi.reducerPath]: todaysWorkoutsApi.reducer,
		[recentActivityApi.reducerPath]: recentActivityApi.reducer,
		[customSummaryApi.reducerPath]: customSummaryApi.reducer,
	},
	middleware: (getDefaultMiddleware) => {
		return getDefaultMiddleware()
			.concat(todaysWorkoutsApi.middleware)
			.concat(historyApi.middleware)
			.concat(summaryApi.middleware)
			.concat(medicationsApi.middleware)
			.concat(recentActivityApi.middleware)
			.concat(statsApi.middleware)
			.concat(habitsApi.middleware)
			.concat(settingsApi.middleware)
			.concat(customSummaryApi.middleware)
			.concat(streaksApi.middleware);
	},
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
