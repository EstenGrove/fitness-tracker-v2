import styles from "../../css/habits/ChangeHabitGoal.module.scss";
import { HabitCard } from "../../features/habits/types";
import { useForm } from "../../hooks/useForm";
import CounterInput from "../shared/CounterInput";
import TextInput from "../shared/TextInput";

type Props = {
	habit: HabitCard;
};

const ChangeHabitGoal = ({ habit }: Props) => {
	const { values, hasChanges, onChange } = useForm({
		habitTarget: habit.habitTarget ?? 0,
		habitUnit: habit.habitUnit ?? "",
	});
	console.log("hasChanges", hasChanges);

	return (
		<div className={styles.ChangeHabitGoal}>
			<h2 className={styles.ChangeHabitGoal_title}>Change Goal</h2>
			<div className={styles.ChangeHabitGoal_form}>
				<div className={styles.ChangeHabitGoal_form_target}>
					<label htmlFor="habitTarget">Set your goal</label>
					<CounterInput
						name="habitTarget"
						id="habitTarget"
						value={values.habitTarget}
						onChange={onChange}
						step={1}
					/>
				</div>
				<div className={styles.ChangeHabitGoal_form_field}>
					<label htmlFor="habitTarget">Set your goal's unit</label>
					<TextInput
						name="habitUnit"
						id="habitUnit"
						value={values.habitUnit}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

export default ChangeHabitGoal;
