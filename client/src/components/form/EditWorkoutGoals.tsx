import styles from "../../css/form/EditWorkoutGoals.module.scss";
import EditWalkInfo from "./EditWalkInfo";
import EditStrengthSets from "./EditStrengthSets";
import EditWorkoutSets from "./EditWorkoutSets";
import { EditWorkoutValues, WorkoutSet } from "../../utils/utils_workouts";
import {
	isExerciseType,
	isStrengthType,
	isWalkType,
} from "../../utils/utils_activity";
import { ExerciseSet, StrengthSet } from "../../features/workouts/types";
import { Activity } from "../../features/shared/types";

type Props = {
	values: EditWorkoutValues;
	sets: WorkoutSet[];
	onChange: (name: string, value: string | number) => void;
	onSetChange: (sets: WorkoutSet[]) => void;
};

type EditActivityProps<T extends object | null> = {
	activityType: Activity;
	values: EditWorkoutValues;
	sets: WorkoutSet[];
	onChange?: (name: string, value: string | number) => void;
	onSetChange?: (sets: T[]) => void;
};

const EditWalkGoals = ({ values, onChange }: EditActivityProps<null>) => {
	const handleChange = (name: string, value: string | number) => {
		return onChange && onChange(name, value);
	};

	return (
		<div className={styles.EditWalkGoals}>
			<EditWalkInfo miles={values.miles} onChange={handleChange} />
		</div>
	);
};

const getInitialSetGoals = (activityType: Activity, sets: WorkoutSet[]) => {
	switch (activityType) {
		case "Strength": {
			const strengthSets = sets as StrengthSet[];
			const baseSet = strengthSets?.[0] ?? { sets: 4, reps: 20, weight: 20 };
			const weight = baseSet.weight;

			return {
				sets: baseSet.sets,
				reps: baseSet.reps,
				weight: weight,
			} as StrengthSet;
		}
		case "Cardio": {
			const cardioSets = sets as ExerciseSet[];
			const baseSet = cardioSets?.[0] ?? { sets: 4, reps: 20 };

			return {
				sets: baseSet.sets,
				reps: baseSet.reps,
				exercise: baseSet.exercise || "Cardio",
			} as ExerciseSet;
		}
		case "Timed":
		case "Other":
		case "Stretch": {
			const stretchSets = sets as ExerciseSet[];
			const baseSet = stretchSets?.[0] ?? { sets: 2, reps: 4 };

			return {
				sets: baseSet.sets,
				reps: baseSet.reps,
				exercise: baseSet.exercise || activityType,
			} as ExerciseSet;
		}
	}
};

const EditStrengthGoals = ({
	sets,
	onSetChange,
}: EditActivityProps<StrengthSet>) => {
	const {
		sets: initialSets,
		reps: initialReps,
		weight: initialWeight,
	} = getInitialSetGoals("Strength", sets) as StrengthSet;
	const handleSets = (sets: StrengthSet[]) => {
		return onSetChange && onSetChange(sets);
	};

	return (
		<div className={styles.EditStrengthGoals}>
			<EditStrengthSets
				sets={initialSets}
				reps={initialReps}
				weight={initialWeight}
				onChange={handleSets}
			/>
		</div>
	);
};
// for 'Cardio', 'Stretch', 'Timed' & 'Other'
const EditSetGoals = ({
	values,
	activityType,
	sets,
	onSetChange,
}: EditActivityProps<ExerciseSet>) => {
	const {
		sets: initialSets,
		reps: initialReps,
		exercise: initialExercise,
	} = getInitialSetGoals(activityType, sets) as ExerciseSet;
	const handleSets = (sets: ExerciseSet[]): void => {
		return onSetChange && onSetChange(sets);
	};

	return (
		<div className={styles.EditSetGoals}>
			<EditWorkoutSets
				sets={initialSets}
				reps={initialReps}
				exercise={initialExercise || values.exercise}
				onChange={handleSets}
			/>
		</div>
	);
};

const EditWorkoutGoals = ({ values, sets, onChange, onSetChange }: Props) => {
	const { activityType } = values;

	return (
		<div className={styles.EditWorkoutGoals}>
			{isStrengthType(activityType) && (
				<EditStrengthGoals
					values={values}
					activityType={activityType}
					sets={sets}
					onSetChange={onSetChange}
				/>
			)}
			{isExerciseType(activityType) && (
				<EditSetGoals
					values={values}
					activityType={activityType}
					sets={sets}
					onSetChange={onSetChange}
				/>
			)}
			{isWalkType(activityType) && (
				<EditWalkGoals
					values={values}
					activityType={activityType}
					sets={sets}
					onChange={onChange}
				/>
			)}
		</div>
	);
};

export default EditWorkoutGoals;
