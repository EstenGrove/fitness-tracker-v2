import sprite from "../assets/icons/main.svg";
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
import { useMedDetails } from "../hooks/useMedDetails";
import MedicationLogHistory from "../components/medications/MedicationLogHistory";
import { useState } from "react";
import ModalLG from "../components/shared/ModalLG";

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

const txtLength = 18; // 18 chars

const NewScheduleButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button
			type="button"
			onClick={onClick}
			className={styles.NewScheduleButton}
		>
			<svg className={styles.NewScheduleButton_icon}>
				<use xlinkHref={`${sprite}#icon-calendar`}></use>
			</svg>
		</button>
	);
};

const MedicationDetailsPage = () => {
	const params = useParams();
	const baseDate = new Date().toString();
	const medID: number = Number(params.id);
	const targetDate = formatDate(baseDate, "long");
	const { data: info } = useMedsInfo(targetDate);
	const { data: details } = useMedDetails(medID);
	const [showNewScheduleModal, setShowNewScheduleModal] =
		useState<boolean>(false);

	const medsInfo = info as MedsInfo;
	const active = getSelectedMedInfo(medID, medsInfo);
	const medication = active?.medication as Medication;
	const medName = addEllipsis(medication?.medName, txtLength);

	const openScheduleModal = () => {
		setShowNewScheduleModal(true);
	};
	const closeScheduleModal = () => {
		setShowNewScheduleModal(false);
	};

	console.log("details", details);

	return (
		<PageContainer>
			<div className={styles.MedicationDetailsPage}>
				<div className={styles.MedicationDetailsPage_header}>
					<NavArrows />
					<PageHeader title={`${medName}`}>
						<NewScheduleButton onClick={openScheduleModal} />
					</PageHeader>
				</div>
				{details && details.logs && (
					<MedicationLogHistory logs={details?.logs} />
				)}
			</div>

			{showNewScheduleModal && (
				<ModalLG onClose={closeScheduleModal}>
					{/*  */}
					{/*  */}
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default MedicationDetailsPage;
