import { describe, it, expect } from "vitest";
import {
	LogWorkoutValues,
	prepareLogWorkout,
} from "../../../utils/utils_workouts";

describe("prepareLogWorkout", () => {
	it("returns a new log workout object", () => {
		const userID = "123";
		const values: LogWorkoutValues = {
			workoutID: 1,
			activityType: "Strength",
			workoutDate: "2021-01-01",
			startTime: "10:00:00",
			endTime: "10:15:00",
			duration: 3600,
			effort: "Easy",
			steps: 0,
			miles: 0,
			pace: 0,
			exercise: "Weekly Curls",
			sets: [
				{
					id: 1,
					sets: 1,
					reps: 20,
					weight: 20,
				},
				{
					id: 2,
					sets: 1,
					reps: 15,
					weight: 20,
				},
			],
		};
		const logWorkout = prepareLogWorkout(userID, values);
		expect(logWorkout).toBeDefined();
	});
});
