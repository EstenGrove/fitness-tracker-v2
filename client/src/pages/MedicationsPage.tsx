import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/MedicationsPage.module.scss";

const MedicationsPage = () => {
	return (
		<PageContainer>
			<div className={styles.MedicationsPage}>
				<div className={styles.MedicationsPage_header}>
					<PageHeader title="Medications">
						{/*  */}
						{/*  */}
					</PageHeader>
				</div>
			</div>
		</PageContainer>
	);
};

export default MedicationsPage;
