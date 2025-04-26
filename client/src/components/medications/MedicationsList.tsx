import styles from "../../css/medications/MedicationsList.module.scss";
import { Medication } from "../../features/medications/types";
import { addEllipsis } from "../../utils/utils_misc";
import { formatDate } from "../../utils/utils_dates";

type Props = {
	medications: Medication[];
	onSelect: (med: Medication) => void;
};

type MedItemProps = {
	med: Medication;
	onSelect: () => void;
};

const MedItem = ({ med, onSelect }: MedItemProps) => {
	const name = addEllipsis(med.medName, 25);
	const dose = med.dosage;
	const endsOn = formatDate(med.scheduleEnd, "short");
	return (
		<div className={styles.MedItem} onClick={onSelect}>
			<div className={styles.MedItem_top}>
				<div className={styles.MedItem_top_name}>
					{name} ({dose})
				</div>
			</div>
			<div className={styles.MedItem_bottom}>
				<div className={styles.MedItem_bottom_about}>Ends on {endsOn}</div>
			</div>
		</div>
	);
};

const MedicationsList = ({ medications, onSelect }: Props) => {
	return (
		<div className={styles.MedicationsList}>
			<div className={styles.MedicationsList_list}>
				{medications &&
					medications.map((med, idx) => (
						<MedItem
							key={med.medID + "-" + idx}
							med={med}
							onSelect={() => onSelect(med)}
						/>
					))}
			</div>
		</div>
	);
};

export default MedicationsList;
