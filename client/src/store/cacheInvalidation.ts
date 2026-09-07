import {
	createListenerMiddleware,
	type Dispatch,
	type UnknownAction,
} from "@reduxjs/toolkit";
import { todaysWorkoutsApi } from "../features/workouts/todaysWorkoutsApi";
import { historyApi } from "../features/history/historyApi";
import { customSummaryApi } from "../features/summary/summaryApi";
import { summaryApi } from "../features/dashboard/summaryApi";

// Single source of truth for cross-API cache invalidation.
// Each RTK Query api slice owns an isolated cache, so invalidatesTags
// can never reach another api's tags directly - it always has to go
// through `otherApi.util.invalidateTags(...)`. This map lays out, per
// mutation, exactly which other apis/tags need to be invalidated -
// one file to check for "what does X affect" or to add a new
// dependency, instead of hunting through onQueryStarted handlers.

interface InvalidationTarget {
	invalidate: (dispatch: Dispatch) => void;
}

// Captures a specific api + its own tag-literal type in a closure, so
// the returned shape is uniform even though each api's TagTypes union
// differs - correctness is checked here, at the call site, once.
function invalidates<TagTypes extends string>(
	api: { util: { invalidateTags: (tags: TagTypes[]) => UnknownAction } },
	tags: TagTypes[],
): InvalidationTarget {
	return {
		invalidate: (dispatch) => {
			dispatch(api.util.invalidateTags(tags));
		},
	};
}

// Method shorthand (vs. an arrow-typed property) opts this field into
// bivariant parameter checking, which is what lets differently-typed
// RTK Query `matchFulfilled` matchers live in one array without TS
// trying to unify their payload types into a single supertype. The
// shape mirrors RTK's own `MatchFunction<UnknownAction>`, which is
// exactly what `startListening({ matcher })` expects.
interface InvalidationRule {
	matcher(action: unknown): action is UnknownAction;
	invalidates: InvalidationTarget[];
}

function onFulfilled<
	Matcher extends (action: unknown) => action is UnknownAction,
>(matcher: Matcher, invalidates: InvalidationTarget[]): InvalidationRule {
	return { matcher, invalidates };
}

const invalidationMap: InvalidationRule[] = [
	// logWorkout -> History, HistoryCalendar, DashboardSummary
	onFulfilled(todaysWorkoutsApi.endpoints.logWorkout.matchFulfilled, [
		invalidates(historyApi, ["History"]),
		invalidates(customSummaryApi, ["HistoryCalendar"]),
		invalidates(summaryApi, ["DashboardSummary"]),
	]),
	// editWorkoutHistory -> HistoryCalendar, DashboardSummary
	onFulfilled(historyApi.endpoints.editWorkoutHistory.matchFulfilled, [
		invalidates(customSummaryApi, ["HistoryCalendar"]),
		invalidates(summaryApi, ["DashboardSummary"]),
	]),
	// deleteWorkoutSession -> HistoryCalendar, DashboardSummary
	onFulfilled(historyApi.endpoints.deleteWorkoutSession.matchFulfilled, [
		invalidates(customSummaryApi, ["HistoryCalendar"]),
		invalidates(summaryApi, ["DashboardSummary"]),
	]),
];

export const cacheInvalidationMiddleware = createListenerMiddleware();

// Start listening to the invalidation map; anytime a matching action is dispatched...
// ..we invalidate the assigned cache tags.
invalidationMap.forEach(({ matcher, invalidates: targets }) => {
	cacheInvalidationMiddleware.startListening({
		matcher,
		effect: (_action, listenerApi) => {
			targets.forEach((target) => target.invalidate(listenerApi.dispatch));
		},
	});
});
