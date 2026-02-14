import { useContext } from "react";
import { WorkoutContext } from "./WorkoutContext";

const useWorkoutContext = () => {
	const context = useContext(WorkoutContext);
	if (context === undefined) {
		throw new Error(
			"useWorkoutContext must be used within a WorkoutContextProvider"
		);
	}
	return context;
};

export { useWorkoutContext };
