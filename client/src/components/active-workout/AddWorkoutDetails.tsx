import styles from "../../css/active-workout/AddWorkoutDetails.module.scss";
import { Activity } from "../../features/shared/types";
import { TodaysWorkout } from "../../features/workouts/types";
import { isExerciseType } from "../../utils/utils_activity";
import { NumberFormatter } from "../../utils/utils_formatter";
import {
	calculateWalkMetrics,
	EndedWorkoutValues,
	WorkoutSet,
} from "../../utils/utils_workouts";
import EditStrengthSets from "../form/EditStrengthSets";
import EditWorkoutSets from "../form/EditWorkoutSets";
import MultiStepModal, { StepItem } from "../shared/MultiStepModal";
import NumberInput from "../shared/NumberInput";
import Select, { SelectOption } from "../shared/Select";

const formatter = new NumberFormatter();

type EndedWithoutSets = Omit<EndedWorkoutValues, "sets" | "exercise">;

type Props = {
	workout: TodaysWorkout;
	values: EndedWithoutSets;
	sets: WorkoutSet[];
	onClose: () => void;
	onSave: () => void;
	onSetChange: (sets: WorkoutSet[]) => void;
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | Date) => void;
};

type DetailsProps = {
	workout: TodaysWorkout;
	values: EndedWithoutSets;
	sets: WorkoutSet[];
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | Date) => void;
	onSetChange: (sets: WorkoutSet[]) => void;
};

// Strength ONLY
const AddStrengthDetails = ({ onSetChange }: DetailsProps) => {
	return (
		<div className={styles.AddStrengthDetails}>
			<label htmlFor="sets" className={styles.AddStrengthDetails_sets}>
				Add set details
			</label>
			<EditStrengthSets reps={20} weight={20} sets={4} onChange={onSetChange} />
		</div>
	);
};
// Walk ONLY
const AddWalkDetails = ({ values, onChange }: DetailsProps) => {
	const metrics = calculateWalkMetrics({
		miles: values.miles,
		duration: values.duration,
	});

	const handleMetrics = () => {
		onChange("steps", metrics.steps);
		onChange("pace", metrics.pace);
	};

	return (
		<div className={styles.AddWalkDetails}>
			<div className={styles.AddWalkDetails_field}>
				<label htmlFor="miles">Enter distance in miles</label>
				<NumberInput
					name="miles"
					id="miles"
					value={values.miles}
					onChange={onChange}
					onBlur={handleMetrics}
					inputMode="decimal"
					style={{ minWidth: "15ch", maxWidth: "20ch" }}
				/>
			</div>
			{values.miles > 0 && (
				<>
					<div className={styles.AddWalkDetails_steps}>
						Steps: <b>{formatter.largeNumber(metrics.steps)} steps</b>
					</div>
					<div className={styles.AddWalkDetails_pace}>
						Pace: <b>{metrics.pace.toFixed(2)}'/mi.</b>
					</div>
				</>
			)}
		</div>
	);
};

const getBaseSets = (sets: WorkoutSet[]) => {
	if (!sets || !sets?.length) {
		return 2;
	} else {
		return sets.length;
	}
};

// Cardio, Stretch, Timed, Other
const AddExerciseDetails = ({ workout, sets, onSetChange }: DetailsProps) => {
	const baseReps = 10;
	const baseSets = getBaseSets(sets);
	return (
		<div className={styles.AddExerciseDetails}>
			<div className={styles.AddExerciseDetails}>
				<label htmlFor="sets" className={styles.AddExerciseDetails_sets}>
					Add set details
				</label>
				<EditWorkoutSets
					reps={baseReps}
					sets={baseSets}
					exercise={workout.activityType}
					onChange={onSetChange}
				/>
			</div>
		</div>
	);
};

const levels: SelectOption[] = [
	"Easy",
	"Moderate",
	"Hard",
	"Strenuous",
	"All Out",
].map((item) => ({
	value: item,
	label: item,
}));

const StepHeader = ({ title }: { title: string }) => {
	return (
		<div className={styles.StepHeader}>
			<h2 className={styles.StepHeader_title}>{title}</h2>
		</div>
	);
};

const EffortStep = ({ values, onChange }: DetailsProps) => {
	return (
		<div className={styles.EffortStep}>
			<StepHeader title="How much effort was this workout?" />
			<Select
				name="effort"
				id="effort"
				value={values.effort}
				options={levels}
				onChange={onChange}
				style={{ minWidth: "100%" }}
			/>
		</div>
	);
};

const getDetailsText = (type: Activity) => {
	switch (type) {
		case "Stretch":
		case "Cardio":
		case "Strength": {
			return "Add " + type + " workout details";
		}
		case "Walk": {
			return "Add details for your walk (optional)";
		}
		case "Timed":
		case "Other": {
			return "Add details for your workout (optional)";
		}

		default:
			return "Add workout details";
	}
};

const DetailsStep = ({
	workout,
	values,
	sets,
	onChange,
	onSelect,
	onSetChange,
}: DetailsProps) => {
	const type = workout.activityType;
	const title = getDetailsText(type);
	const isWalk = type === "Walk";
	const isStrength = type === "Strength";
	const isExercise = isExerciseType(type);

	return (
		<div className={styles.DetailsStep}>
			<StepHeader title={title} />
			<div className={styles.DetailsStep_main}>
				{isStrength && (
					<AddStrengthDetails
						sets={sets}
						workout={workout}
						values={values}
						onChange={onChange}
						onSelect={onSelect}
						onSetChange={onSetChange}
					/>
				)}
				{isWalk && (
					<AddWalkDetails
						sets={sets}
						workout={workout}
						values={values}
						onChange={onChange}
						onSelect={onSelect}
						onSetChange={onSetChange}
					/>
				)}
				{isExercise && (
					<AddExerciseDetails
						sets={sets}
						workout={workout}
						values={values}
						onChange={onChange}
						onSelect={onSelect}
						onSetChange={onSetChange}
					/>
				)}
			</div>
		</div>
	);
};

const AddWorkoutDetails = ({
	workout,
	values,
	sets,
	onChange,
	onSelect,
	onSetChange,
	onClose,
	onSave,
}: Props) => {
	const steps: StepItem[] = [
		{
			id: 1,
			title: "Effort Step",
			content: (
				<EffortStep
					sets={sets}
					workout={workout}
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onSetChange={onSetChange}
				/>
			),
			next: 2,
			validate: () => true,
		},
		{
			id: 2,
			title: "Details Step",
			content: (
				<DetailsStep
					sets={sets}
					workout={workout}
					values={values}
					onChange={onChange}
					onSelect={onSelect}
					onSetChange={onSetChange}
				/>
			),
			prev: 1,
			validate: () => true,
		},
	];

	return (
		<>
			<MultiStepModal steps={steps} onClose={onClose} onSave={onSave} />
		</>
	);
};

export default AddWorkoutDetails;
