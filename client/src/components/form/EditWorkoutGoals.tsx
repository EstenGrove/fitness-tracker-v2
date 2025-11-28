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

type Props = {
	values: EditWorkoutValues;
	onChange: (name: string, value: string | number) => void;
	onSetChange: (sets: WorkoutSet[]) => void;
};

type EditActivityProps<T extends object | null> = {
	values: EditWorkoutValues;
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
const EditStrengthGoals = ({ onSetChange }: EditActivityProps<StrengthSet>) => {
	const handleSets = (sets: StrengthSet[]) => {
		return onSetChange && onSetChange(sets);
	};

	return (
		<div className={styles.EditStrengthGoals}>
			<EditStrengthSets sets={0} reps={0} weight={0} onChange={handleSets} />
		</div>
	);
};
// for 'Cardio', 'Stretch', 'Timed' & 'Other'
const EditSetGoals = ({
	values,
	onSetChange,
}: EditActivityProps<ExerciseSet>) => {
	const handleSets = (sets: ExerciseSet[]): void => {
		return onSetChange && onSetChange(sets);
	};

	return (
		<div className={styles.EditSetGoals}>
			<EditWorkoutSets
				sets={0}
				reps={0}
				exercise={values.exercise}
				onChange={handleSets}
			/>
		</div>
	);
};

const EditWorkoutGoals = ({ values, onChange, onSetChange }: Props) => {
	const { activityType } = values;

	return (
		<div className={styles.EditWorkoutGoals}>
			{isStrengthType(activityType) && (
				<EditStrengthGoals values={values} onSetChange={onSetChange} />
			)}
			{isExerciseType(activityType) && (
				<EditSetGoals values={values} onSetChange={onSetChange} />
			)}

			{isWalkType(activityType) && (
				<EditWalkGoals values={values} onChange={onChange} />
			)}
		</div>
	);
};

export default EditWorkoutGoals;
