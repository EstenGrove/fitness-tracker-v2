import styles from "../../css/medications/MedicationsCard.module.scss";
import { Medication } from "../../features/medications/types";
import DetailsCard from "../layout/DetailsCard";
import MedicationsList from "./MedicationsList";

type Props = {
	medications: Medication[];
	onSelect: (med: Medication) => void;
};

const MedicationsCard = ({ medications, onSelect }: Props) => {
	return (
		<DetailsCard icon="pillBottle" title="Active Medications" to="all">
			<div className={styles.MedicationsCard}>
				<MedicationsList medications={medications} onSelect={onSelect} />
			</div>
		</DetailsCard>
	);
};

export default MedicationsCard;
