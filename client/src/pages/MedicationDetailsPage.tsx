import styles from "../css/pages/MedicationDetailsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import NavArrows from "../components/layout/NavArrows";

const MedicationDetailsPage = () => {
	return (
		<PageContainer>
			<div className={styles.MedicationDetailsPage}>
				<NavArrows />
				<div className={styles.MedicationDetailsPage_header}>
					<PageHeader title="Medication Details">
						{/*  */}
						{/*  */}
					</PageHeader>
				</div>
			</div>
		</PageContainer>
	);
};

export default MedicationDetailsPage;
