import styles from "../css/pages/MedicationDetailsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import NavArrows from "../components/layout/NavArrows";
import { formatDate } from "../utils/utils_dates";
import { useMedsInfo } from "../hooks/useMedsInfo";
import { MedsInfo } from "../utils/utils_medications";
import { useParams } from "react-router";
import { Medication, MedicationSchedule } from "../features/medications/types";
import { addEllipsis } from "../utils/utils_misc";

const getSelectedMedInfo = (medID: number, medsInfo: MedsInfo) => {
	if (!medID || !medsInfo) return { medication: null, schedule: null };

	const { activeMeds, activeSchedules } = medsInfo;

	console.log("activeMeds", activeMeds);

	const schedule = activeSchedules.find((item) => item.medID === medID);
	const medication = activeMeds.find((item) => item.medicationID === medID);

	return {
		medication: medication as Medication,
		schedule: schedule as MedicationSchedule,
	};
};

const MedicationDetailsPage = () => {
	const params = useParams();
	const baseDate = new Date().toString();
	const medID: number = Number(params.id);
	const targetDate = formatDate(baseDate, "long");
	const { data } = useMedsInfo(targetDate);
	const medsInfo = data as MedsInfo;
	const active = getSelectedMedInfo(medID, medsInfo);
	const medication = active?.medication as Medication;
	const medName = addEllipsis(medication?.medName, 18);
	return (
		<PageContainer>
			<div className={styles.MedicationDetailsPage}>
				<NavArrows />
				<div className={styles.MedicationDetailsPage_header}>
					<PageHeader title={`${medName}`}>
						{/*  */}
						{/*  */}
					</PageHeader>
				</div>
			</div>
		</PageContainer>
	);
};

export default MedicationDetailsPage;
