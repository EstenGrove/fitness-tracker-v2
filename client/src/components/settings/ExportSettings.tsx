import sprite from "../../assets/icons/exports.svg";
import styles from "../../css/settings/ExportSettings.module.scss";
import { useState } from "react";
import ModalSM from "../shared/ModalSM";

type ExportQueryType =
	| "workout-history"
	| "medication-history"
	| "session-history";

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

type ExportOptsProps = {
	openExportModal: (type: ExportQueryType) => void;
};

const ExportOptions = ({ openExportModal }: ExportOptsProps) => {
	return (
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
	);
};

const ExportSettings = () => {
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
		<div className={styles.ExportSettings}>
			<ExportOptions openExportModal={openExportModal} />

			{showExportModal && (
				<ModalSM onClose={closeModal}>
					<h2>Export: {exportType && exportType.toUpperCase()}</h2>
					{/*  */}
					{/*  */}
				</ModalSM>
			)}
		</div>
	);
};

export default ExportSettings;
