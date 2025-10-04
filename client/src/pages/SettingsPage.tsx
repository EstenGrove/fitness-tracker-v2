import { useState } from "react";
import sprite from "../assets/icons/exports.svg";
import PageContainer from "../components/layout/PageContainer";
import styles from "../css/pages/SettingsPage.module.scss";
import ModalSM from "../components/shared/ModalSM";

// REQUIREMENTS:
// - Show accordion sections for:
// - User, Workouts, Medications, History, Dashboard etc.

const ExportButton = ({
	onClick,
	text = "Export",
}: {
	text: string;
	onClick: () => void;
}) => {
	return (
		<button type="button" onClick={onClick} className={styles.ExportButton}>
			<svg className={styles.ExportButton_icon}>
				<use xlinkHref={`${sprite}#icon-file_present`}></use>
			</svg>
			<span> {text} </span>
		</button>
	);
};

type ExportQueryType =
	| "workout-history"
	| "medication-history"
	| "session-history";

const SettingsPage = () => {
	const [exportType, setExportType] = useState<ExportQueryType | null>(null);
	const [showExportModal, setShowExportModal] = useState<boolean>(false);

	const openExportModal = (type: ExportQueryType) => {
		setExportType(type);
		openModal();
	};

	const openModal = () => {
		setShowExportModal(true);
	};
	const closeModal = () => {
		setShowExportModal(false);
	};

	return (
		<PageContainer>
			<div className={styles.SettingsPage}>
				<div className={styles.SettingsPage_header}>
					<h2>Settings</h2>
				</div>
				<div className={styles.SettingsPage_main}>
					<ExportButton
						onClick={() => openExportModal("workout-history")}
						text="Export Workouts"
					/>
					<ExportButton
						onClick={() => openExportModal("medication-history")}
						text="Export Meds"
					/>
					<ExportButton
						onClick={() => openExportModal("session-history")}
						text="Export Sessions"
					/>
				</div>
			</div>

			{showExportModal && (
				<ModalSM onClose={closeModal}>
					<h2>Export: {exportType && exportType.toUpperCase()}</h2>
					{/*  */}
					{/*  */}
				</ModalSM>
			)}
		</PageContainer>
	);
};

export default SettingsPage;
