import styles from "../css/pages/MedicationDetailsPage.module.scss";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import NavArrows from "../components/layout/NavArrows";
import { formatDate } from "../utils/utils_dates";
import { useMedsInfo } from "../hooks/useMedsInfo";
import { MedsInfo } from "../utils/utils_medications";
import { useParams } from "react-router";

const MedicationDetailsPage = () => {
	const baseDate = new Date().toString();
	const targetDate = formatDate(baseDate, "long");
	const params = useParams();
	const medID: number = Number(params.id);
	const { data } = useMedsInfo(targetDate);
	const medsInfo = data as MedsInfo;
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
