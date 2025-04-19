import { ChangeEvent, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/form/EditStrengthSets.module.scss";
import { StrengthSet, StrengthWorkout } from "../../features/workouts/types";

type Props = {
	sets: number;
	reps: number;
	weight: number;
	onChange: (sets: StrengthSet[]) => void;
};

const generateStrengthSets = (
	workout: Pick<StrengthWorkout, "sets" | "reps" | "weight">
) => {
	const { sets, reps, weight } = workout;
	const workoutSets: StrengthSet[] = [];

	for (let i = 0; i < sets; i++) {
		const entry: StrengthSet = {
			id: i + 1,
			sets: 1,
			reps: reps,
			weight,
		};
		workoutSets.push(entry);
	}

	return workoutSets;
};

type SetProps = {
	idx: number;
	set: StrengthSet;
	updateSet: (idx: number, updatedSet: StrengthSet) => void;
	deleteSet: () => void;
};
const SetEntry = ({ idx, set, updateSet, deleteSet }: SetProps) => {
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
					<label htmlFor="reps">Reps</label>
				</div>
				<div className={styles.divider}>x</div>
				<div className={styles.SetEntry_item}>
					<input
						type="number"
						name="weight"
						id="weight"
						value={set.weight}
						onChange={onChange}
						onFocus={(ref) => ref.currentTarget.select()}
						className={styles.SetEntry_item_input}
						inputMode="numeric"
					/>
					<label htmlFor="weight">lbs.</label>
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

const EditStrengthSets = ({ sets, reps, weight, onChange }: Props) => {
	const base = {
		sets: sets ?? 4,
		reps: reps ?? 20,
		weight: weight ?? 20,
	};
	const [, setNewSet] = useState<StrengthSet | null>(null);
	const [workoutSets, setWorkoutSets] = useState<StrengthSet[]>(
		generateStrengthSets(base)
	);

	const addNewSet = () => {
		const lastItem = workoutSets[workoutSets.length - 1];
		const lastID = lastItem.id;
		const newEntry = {
			id: lastID + 1,
			sets: base.sets,
			reps: base.reps,
			weight: base.weight,
		};
		const newSets = [...workoutSets, newEntry];
		setNewSet(newEntry);
		setWorkoutSets(newSets);

		return onChange && onChange(newSets);
	};

	const updateSet = (idx: number, set: StrengthSet) => {
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
		<div className={styles.EditStrengthSets}>
			{workoutSets &&
				workoutSets.map((set, idx) => {
					return (
						<SetEntry
							key={set.id}
							idx={idx}
							set={set}
							updateSet={updateSet}
							deleteSet={() => deleteSet(idx)}
						/>
					);
				})}
			<div className={styles.EditStrengthSets_action}>
				<button type="button" onClick={addNewSet} className={styles.AddSet}>
					Add Set
				</button>
			</div>
		</div>
	);
};

export default EditStrengthSets;
