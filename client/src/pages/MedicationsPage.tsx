import { useState } from "react";
import sprite from "../assets/icons/main.svg";
import styles from "../css/pages/MedicationsPage.module.scss";
import { useWeekHeader } from "../hooks/useWeekHeader";
import {
	MedLogEntry,
	PillSummary as IPillSummary,
	MedicationSchedule,
} from "../features/medications/types";
import { formatDate, parseDateStr } from "../utils/utils_dates";
import { useMedSummary } from "../hooks/useMedSummary";
import { useMedsInfo } from "../hooks/useMedsInfo";
import { MedsInfo } from "../utils/utils_medications";
import ModalLG from "../components/shared/ModalLG";
import PageHeader from "../components/layout/PageHeader";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import PageContainer from "../components/layout/PageContainer";
import PillSummary from "../components/medications/PillSummary";
import LogMedication from "../components/medications/LogMedication";
import Loader from "../components/layout/Loader";
import TodaysDoses from "../components/medications/TodaysDoses";
import LoggedMedsCard from "../components/medications/LoggedMedsCard";
import { isWithinInterval } from "date-fns";

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
	scheduleID: 9,
};

const getActiveSchedule = (medsInfo: MedsInfo): MedicationSchedule => {
	if (medsInfo?.activeSchedules && medsInfo?.activeSchedules?.length > 0) {
		const now = new Date();
		const match =
			medsInfo?.activeSchedules?.find((s) => {
				const start = new Date(s.startDate);
				const end = new Date(s.endDate);
				return isWithinInterval(now, { start, end });
			}) ?? medsInfo?.activeSchedules?.[0];

		return match;
	}
	return { ...myMed } as unknown as MedicationSchedule;
};

const MedicationsPage = () => {
	const baseDate = new Date().toString();
	const header = useWeekHeader(baseDate);
	const targetDate = prepareTargetDate(header.selectedDate);
	const { data: medsInfo } = useMedsInfo(targetDate);
	const { data, isLoading } = useMedSummary(myMed.medID, targetDate);
	const [showLogMedModal, setShowLogMedModal] = useState<boolean>(false);
	const [selectedMed, setSelectedMed] = useState<CurrentMed | null>(myMed);
	const pillSummary = data?.pillSummary as IPillSummary;
	const medLogs = (data?.medicationLogs ?? []) as MedLogEntry[];
	const userMedsInfo = medsInfo as MedsInfo;
	const activeSchedule = getActiveSchedule(userMedsInfo);

	// console.log("activeSchedule", activeSchedule);

	const openModal = () => {
		setShowLogMedModal(true);
	};
	const closeModal = () => {
		setShowLogMedModal(false);
	};

	const onSave = () => {
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
						<LoggedMedsCard
							to={`/meds/details/${selectedMed?.medID}`}
							pillsTakenToday={pillSummary?.pillsTakenToday}
						>
							<TodaysDoses logs={medLogs} />
						</LoggedMedsCard>
					</div>
				)}
			</div>

			{showLogMedModal && (
				<ModalLG onClose={closeModal}>
					<LogMedication
						logs={medLogs}
						onSave={onSave}
						selectedDate={baseDate}
						medication={
							{
								...selectedMed,
								scheduleID: activeSchedule.scheduleID,
							} as CurrentMed
						}
						summary={pillSummary as IPillSummary}
					/>
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default MedicationsPage;
