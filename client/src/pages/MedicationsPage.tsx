import { useState } from "react";
import sprite from "../assets/icons/main.svg";
import styles from "../css/pages/MedicationsPage.module.scss";
import { useWeekHeader } from "../hooks/useWeekHeader";
import { PillSummary as IPillSummary } from "../features/medications/types";
import ModalLG from "../components/shared/ModalLG";
import PageHeader from "../components/layout/PageHeader";
import WeeklyHeader from "../components/layout/WeeklyHeader";
import PageContainer from "../components/layout/PageContainer";
import PillSummary from "../components/medications/PillSummary";
import LogMedication from "../components/medications/LogMedication";
import { useGetMedSummaryByDateQuery } from "../features/medications/medicationsApi";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { formatDate } from "../utils/utils_dates";

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

const MedicationsPage = () => {
	const baseDate = new Date().toString();
	const header = useWeekHeader(baseDate);
	const currentUser = useSelector(selectCurrentUser);
	const [showLogMedModal, setShowLogMedModal] = useState<boolean>(false);
	const { data, isLoading } = useGetMedSummaryByDateQuery({
		userID: currentUser.userID,
		medID: 1,
		targetDate: formatDate(baseDate, "db"),
	});
	const [selectedMed, setSelectedMed] = useState<CurrentMed | null>({
		medID: 1,
		name: "Buprenorphine",
		scheduleID: 3,
	});

	console.log("data", data);

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
				<div className={styles.MedicationsPage_main}>
					<PillSummary title="Buprenorphine" />
				</div>
			</div>

			{showLogMedModal && (
				<ModalLG onClose={closeModal}>
					<LogMedication
						selectedDate={baseDate}
						medication={selectedMed as CurrentMed}
						onSave={onSave}
						summary={{} as IPillSummary}
					/>
				</ModalLG>
			)}
		</PageContainer>
	);
};

export default MedicationsPage;
