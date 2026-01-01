import { useSelector } from "react-redux";
import styles from "../../css/habits/ChangeHabitGoal.module.scss";
import { useChangeHabitGoalMutation } from "../../features/habits/habitsApi";
import { HabitCard } from "../../features/habits/types";
import { useForm } from "../../hooks/useForm";
import CounterInput from "../shared/CounterInput";
import TextInput from "../shared/TextInput";
import { selectCurrentUser } from "../../features/user/userSlice";

type Props = {
	habit: HabitCard;
	onClose?: () => void;
};

type FooterProps = {
	onCancel: () => void;
	onSave: () => void;
};
const Footer = ({ onCancel, onSave }: FooterProps) => {
	return (
		<div className={styles.Footer}>
			<button type="button" onClick={onCancel} className={styles.Footer_cancel}>
				Cancel
			</button>
			<button type="button" onClick={onSave} className={styles.Footer_save}>
				Update
			</button>
		</div>
	);
};

const ChangeHabitGoal = ({ habit, onClose }: Props) => {
	const currentUser = useSelector(selectCurrentUser);
	const [changeHabitGoal] = useChangeHabitGoalMutation();
	const { values, hasChanges, onChange } = useForm({
		habitTarget: habit.habitTarget ?? 0,
		habitUnit: habit.habitUnit ?? "",
	});
	console.log("habit:", habit);
	console.log("hasChanges", hasChanges);

	const cancelChanges = () => {
		handleClose();
	};

	const confirmChanges = async () => {
		if (!hasChanges) return;
		const { userID } = currentUser;
		const { habitTarget, habitUnit } = values;

		const result = await changeHabitGoal({
			userID: userID,
			habitID: habit.habitID,
			newGoal: habitTarget,
			newGoalUnit: habitUnit,
		});

		console.log("changed goal:", result);
		handleClose();
	};

	const handleClose = () => {
		return onClose && onClose();
	};

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
			<div className={styles.ChangeHabitGoal_footer}>
				<Footer onCancel={cancelChanges} onSave={confirmChanges} />
			</div>
		</div>
	);
};

export default ChangeHabitGoal;
