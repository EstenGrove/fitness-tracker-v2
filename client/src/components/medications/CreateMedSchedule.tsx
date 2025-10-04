import { useState } from "react";
import styles from "../../css/medications/CreateMedSchedule.module.scss";
import { addDays } from "date-fns";
import { formatDate } from "../../utils/utils_dates";
import DatePicker from "../shared/DatePicker";
import NumberInput from "../shared/NumberInput";
import { NewMedScheduleArgs } from "../../utils/utils_medications";
import { useCreateMedScheduleMutation } from "../../features/medications/medicationsApi";

type Props = {
	userID: string;
	medicationID: number;
	scheduleLength?: number;
	onClose: () => void;
};

interface NewMedScheduleValues {
	medicationID: number;
	startDate: string;
	endDate: string;
	dosage: number;
	dosagePerInterval: number;
	quantity: number;
}

const calculateDateRanges = (
	length: number = 30,
	baseDate: Date | string = new Date()
) => {
	const start = new Date(baseDate);
	const end = addDays(start, length);
	const startDate = formatDate(start, "short");
	const endDate = formatDate(end, "short");

	return {
		startDate: startDate,
		endDate: endDate,
	};
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
				Save
			</button>
		</div>
	);
};

const CreateMedSchedule = ({
	userID,
	medicationID,
	scheduleLength = 30,
	onClose,
}: Props) => {
	const [createNewMedSchedule] = useCreateMedScheduleMutation();
	const [scheduleValues, setScheduleValues] = useState<NewMedScheduleValues>({
		medicationID: medicationID,
		dosage: 2,
		dosagePerInterval: 2,
		quantity: 60,
		...calculateDateRanges(scheduleLength),
	});

	const onChange = (name: string, date: number | string) => {
		setScheduleValues({
			...scheduleValues,
			[name]: date,
		});
	};
	const onDateSelect = (name: string, date: Date | string) => {
		setScheduleValues({
			...scheduleValues,
			[name]: date,
		});
	};

	const createSchedule = async () => {
		const params: NewMedScheduleArgs = {
			...scheduleValues,
			dosageDesc: `${scheduleValues.dosage} pills per day`,
			frequency: `1 day`,
			medID: 1,
			userID: userID,
		};

		const result = await createNewMedSchedule(params);

		console.log("UI Result:", result);

		if (result) {
			onClose();
		}
	};

	return (
		<div className={styles.CreateMedSchedule}>
			<div className={styles.CreateMedSchedule_header}>
				Add a new medication schedule
			</div>
			<div className={styles.CreateMedSchedule_main}>
				<div className={styles.CreateMedSchedule_main_field}>
					<label htmlFor="startDate">Schedule Start</label>
					<DatePicker
						name="startDate"
						id="startDate"
						value={scheduleValues.startDate}
						onSelect={onDateSelect}
					/>
				</div>
				<div className={styles.CreateMedSchedule_main_field}>
					<label htmlFor="endDate">Schedule End</label>
					<DatePicker
						name="endDate"
						id="endDate"
						value={scheduleValues.endDate}
						onSelect={onDateSelect}
					/>
				</div>
				<div className={styles.CreateMedSchedule_main_field}>
					<label htmlFor="dosage">Dosage (pills per day)</label>
					<NumberInput
						name="dosage"
						id="dosage"
						value={scheduleValues.dosage}
						onChange={onChange}
					/>
				</div>
				<div className={styles.CreateMedSchedule_main_field}>
					<label htmlFor="dosage">Quantity (pills per schedule)</label>
					<NumberInput
						name="quantity"
						id="quantity"
						value={scheduleValues.quantity}
						onChange={onChange}
					/>
				</div>
			</div>
			<div className={styles.CreateMedSchedule_actions}>
				<Footer onCancel={onClose} onSave={createSchedule} />
			</div>
		</div>
	);
};

export default CreateMedSchedule;
