import { useState } from "react";
import sprite from "../assets/icons/main.svg";
import styles from "../css/pages/MedicationsPage.module.scss";
import { useWeekHeader } from "../hooks/useWeekHeader";
import {
	MedLogEntry,
	PillSummary as IPillSummary,
} from "../features/medications/types";
import ModalLG from "../components/shared/ModalLG";
import PageHeader from "../components/layout/PageHeader";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import PageContainer from "../components/layout/PageContainer";
import PillSummary from "../components/medications/PillSummary";
import LogMedication from "../components/medications/LogMedication";
import { useGetMedSummaryByDateQuery } from "../features/medications/medicationsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate, parseDateStr } from "../utils/utils_dates";
import Loader from "../components/layout/Loader";

const LogMedButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.LogMedButton}>
			<svg className={styles.LogMedButton_icon}>
				<use xlinkHref={`${sprite}#icon-pill`}></use>
			</svg>
			<span>Log</span>
		</button>
	);
};

interface CurrentMed {
	medID: number;
	name: string;
	scheduleID: number;
}

const prepareTargetDate = (date: string) => {
	const parsed = parseDateStr(date);

	return formatDate(parsed, "clean");
};

const myMed = {
	medID: 1,
	name: "Buprenorphine",
	scheduleID: 1,
};

const MedicationsPage = () => {
	const baseDate = new Date().toString();
	const header = useWeekHeader(baseDate);
	const currentUser = useSelector(selectCurrentUser);
	const [showLogMedModal, setShowLogMedModal] = useState<boolean>(false);
	const targetDate = prepareTargetDate(header.selectedDate);
	const { data, isLoading } = useGetMedSummaryByDateQuery({
		medID: myMed.medID,
		userID: currentUser.userID,
		targetDate: targetDate,
	});
	const [selectedMed, setSelectedMed] = useState<CurrentMed | null>(myMed);
	const pillSummary = data?.pillSummary as IPillSummary;
	const medLogs = data?.medicationLogs as MedLogEntry[];

	console.log("data", data);

	const selectMed = (med: CurrentMed) => {
		setSelectedMed(med);
	};
	const deSelectMed = () => {
		setSelectedMed(null);
	};

	const openModal = () => {
		setShowLogMedModal(true);
	};
	const closeModal = () => {
		setShowLogMedModal(false);
	};

	const onSave = async () => {
		// do stuff

		closeModal();
	};

	return (
		<PageContainer>
			<div className={styles.MedicationsPage}>
				<div className={styles.MedicationsPage_header}>
					<PageHeader title="Medications">
						<LogMedButton onClick={openModal} />
					</PageHeader>
					<WeeklyHeader
						baseDate={baseDate}
						onSelect={header.selectDate}
						selectedDate={header.selectedDate}
					/>
				</div>

				{isLoading && (
					<div className={styles.MedicationsPage_main}>
						<Loader>
							<span>Loading meds...</span>
						</Loader>
					</div>
				)}

				{!isLoading && (
					<div className={styles.MedicationsPage_main}>
						<PillSummary
							title="Buprenorphine"
							medID={selectedMed?.medID as number}
							daysLeft={pillSummary?.daysLeft}
							pillsTaken={pillSummary?.pillsTaken}
							totalPills={pillSummary?.totalPills}
							pillsLeft={pillSummary?.pillsRemaining}
						/>
					</div>
				)}
			</div>

			{showLogMedModal && (
				<ModalLG onClose={closeModal}>
					<LogMedication
						logs={medLogs}
						onSave={onSave}
						selectedDate={baseDate}
						medication={selectedMed as CurrentMed}
						summary={pillSummary as IPillSummary}
					/>
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default MedicationsPage;
