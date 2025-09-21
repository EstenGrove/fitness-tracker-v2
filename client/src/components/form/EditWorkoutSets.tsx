import { ChangeEvent, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/form/EditWorkoutSets.module.scss";
import {
	CardioWorkout,
	ExerciseSet,
	OtherWorkout,
	StretchWorkout,
	TimedWorkout,
} from "../../features/workouts/types";

type Props = {
	sets: number;
	reps: number;
	exercise: string;
	onChange: (sets: ExerciseSet[]) => void;
};

export type ExerciseWorkout =
	| CardioWorkout
	| StretchWorkout
	| TimedWorkout
	| OtherWorkout;

const generateSets = (
	workout: Pick<ExerciseWorkout, "sets" | "reps" | "exercise">
) => {
	const { sets, reps, exercise } = workout;
	const workoutSets: ExerciseSet[] = [];

	for (let i = 0; i < sets; i++) {
		const entry: ExerciseSet = {
			id: i + 1,
			reps: reps,
			exercise: exercise || "",
			sets: sets ?? 1,
		};
		workoutSets.push(entry);
	}

	return workoutSets;
};

type SetProps = {
	idx: number;
	set: ExerciseSet;
	exercise?: string;
	updateSet: (idx: number, updatedSet: ExerciseSet) => void;
	deleteSet: () => void;
};
const SetEntry = ({
	idx,
	set,
	exercise = "",
	updateSet,
	deleteSet,
}: SetProps) => {
	const onChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		const values = {
			...set,
			[name]: value,
		};
		updateSet(idx, values);
	};

	return (
		<div className={styles.SetEntry}>
			<div className={styles.SetEntry_title}>
				<div>{idx + 1}</div>
			</div>
			<div className={styles.SetEntry_fields}>
				<div className={styles.SetEntry_item}>
					<input
						type="number"
						name="reps"
						id="reps"
						value={set.reps}
						onChange={onChange}
						onFocus={(ref) => ref.currentTarget.select()}
						className={styles.SetEntry_item_input}
						inputMode="numeric"
					/>
					<label htmlFor="reps">reps </label>
				</div>
				<div className={styles.divider}>:</div>
				<div className={styles.SetEntry_item}>
					<input
						type="text"
						name="exercise"
						id="exercise"
						value={set.exercise ?? exercise}
						onChange={onChange}
						onFocus={(ref) => ref.currentTarget.select()}
						className={styles.SetEntry_item_exercise}
					/>
				</div>
				<button onClick={deleteSet} className={styles.SetEntry_item_delete}>
					<svg className={styles.SetEntry_item_delete_icon}>
						<use xlinkHref={`${sprite}#icon-delete`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};

const EditWorkoutSets = ({ sets, reps, exercise, onChange }: Props) => {
	const base = {
		sets: sets ?? 4,
		reps: reps ?? 20,
		exercise: exercise || "",
	};
	const [, setNewSet] = useState<ExerciseSet | null>(null);
	const [workoutSets, setWorkoutSets] = useState<ExerciseSet[]>(
		generateSets(base)
	);

	const addNewSet = () => {
		const lastItem = workoutSets[workoutSets.length - 1];
		const lastID = lastItem.id;
		const newEntry = {
			id: lastID + 1,
			sets: base.sets,
			reps: base.reps,
			exercise: base.exercise,
		};
		const newSets = [...workoutSets, newEntry];
		setNewSet(newEntry);
		setWorkoutSets(newSets);

		return onChange && onChange(newSets);
	};

	const updateSet = (idx: number, set: ExerciseSet) => {
		const newSets = [...workoutSets].map((entry, i) => {
			if (i === idx) {
				return {
					...entry,
					...set,
				};
			} else {
				return entry;
			}
		});
		setWorkoutSets(newSets);

		return onChange && onChange(newSets);
	};

	const deleteSet = (idx: number) => {
		const newSets = [...workoutSets].filter((_, i) => i !== idx);
		setWorkoutSets(newSets);

		return onChange && onChange(newSets);
	};

	return (
		<div className={styles.EditWorkoutSets}>
			{workoutSets &&
				workoutSets.map((set, idx) => {
					return (
						<SetEntry
							key={set.id}
							idx={idx}
							set={set || 1}
							exercise={exercise ?? ""}
							updateSet={updateSet}
							deleteSet={() => deleteSet(idx)}
						/>
					);
				})}
			<button onClick={addNewSet} className={styles.AddSet}>
				Add Set
			</button>
		</div>
	);
};

export default EditWorkoutSets;
