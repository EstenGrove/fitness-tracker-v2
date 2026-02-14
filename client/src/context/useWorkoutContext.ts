import { useContext } from "react";
import { WorkoutContextType, WorkoutContext } from "./WorkoutContext";

// Hook to access the workout timer context
export const useWorkoutTimerContext = (): WorkoutContextType => {
	const context = useContext(WorkoutContext);
	if (context === undefined) {
		throw new Error(
			"useWorkoutTimerContext must be used within a WorkoutContextProvider"
		);
	}
	return context;
};
