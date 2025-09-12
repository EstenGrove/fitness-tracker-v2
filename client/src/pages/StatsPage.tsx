import styles from "../css/pages/StatsPage.module.scss";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { Outlet, useNavigate, useParams } from "react-router";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";

type StatsCategory = "mins" | "steps" | "workouts" | "activity";
type StatsRouteParams = { category: StatsCategory };

const StatsPage = () => {
	const navigate = useNavigate();
	const { category } = useParams<StatsRouteParams>();
	// const currentUser = useSelector(selectCurrentUser);

	const backToDashboard = () => {
		navigate("/");
	};

	console.log("category", category);
	return (
		<PageContainer>
			<div className={styles.StatsPage}>
				<NavArrows onBack={backToDashboard} />
				<div className={styles.StatsPage_title}>Stats</div>
				<div className={styles.StatsPage_main}>
					<Outlet />
				</div>
			</div>
		</PageContainer>
	);
};

export default StatsPage;
