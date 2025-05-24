import { useState } from "react";
import styles from "../../css/habits/HabitsList.module.scss";
import { HabitCard as IHabitCard } from "../../features/habits/types";
import HabitCard from "./HabitCard";
import ModalSM from "../shared/ModalSM";
import ChangeHabitGoal from "./ChangeHabitGoal";
import ModalWithFooter from "../shared/ModalWithFooter";
import DeleteHabit from "./DeleteHabit";

type Props = {
	habits: IHabitCard[];
};
type HabitModalType = "CREATE" | "EDIT" | "DELETE";
enum EHabitModalType {
	CREATE = "CREATE",
	EDIT = "EDIT",
	DELETE = "DELETE",
}
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

const HabitsList = ({ habits = [] }: Props) => {
	const [selectedHabit, setSelectedHabit] = useState<IHabitCard | null>(null);
	const [modalType, setModalType] = useState<HabitModalType | null>(null);

	const selectHabitAction = (action: HabitModalType, habit: IHabitCard) => {
		setSelectedHabit(habit);
		openModal(action);
	};

	const openModal = (type: HabitModalType) => {
		setModalType(type);
	};
	const closeModal = () => {
		setModalType(null);
		setSelectedHabit(null);
	};

	const saveGoalChanges = async () => {
		// do stuff
	};

	const confirmDelete = async () => {
		// do stuff
	};

	return (
		<div className={styles.HabitsList}>
			<div className={styles.HabitsList_container}>
				{habits &&
					habits.map((habit, idx) => {
						return (
							<HabitCard key={idx} habit={habit} onAction={selectHabitAction} />
						);
					})}
			</div>

			{/* CHANGE GOAL */}
			{modalType === EHabitModalType.EDIT && (
				<ModalWithFooter
					onClose={closeModal}
					size="SM"
					footer={<Footer onCancel={closeModal} onSave={saveGoalChanges} />}
				>
					<ChangeHabitGoal habit={selectedHabit as IHabitCard} />
				</ModalWithFooter>
			)}
			{/* DELETE */}
			{modalType === EHabitModalType.DELETE && (
				<ModalSM onClose={closeModal}>
					<DeleteHabit onCancel={closeModal} onConfirm={confirmDelete} />
				</ModalSM>
			)}
		</div>
	);
};

export default HabitsList;
