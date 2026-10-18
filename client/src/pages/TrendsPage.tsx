import styles from "../css/pages/TrendsPage.module.scss";
import { useNavigate } from "react-router";
import { TrendCategoryKey } from "../features/trends-hub/types";
import { useTrendPeriod } from "../hooks/useTrendPeriod";
import { useTrendsOverview } from "../hooks/useTrendsOverview";
import { formatPeriodRange } from "../utils/utils_trendsHub";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import Loader from "../components/layout/Loader";
import NoData from "../components/ui/NoData";
import TrendPeriodSelector from "../components/trends-hub/TrendPeriodSelector";
import TrendCategoryCard from "../components/trends-hub/TrendCategoryCard";

// Trends hub: one card per category (headline KPI + top insight); each opens its detail page

const TrendsPage = () => {
	const navigate = useNavigate();
	const { period, setPeriod } = useTrendPeriod();
	const { overview, isLoading, isFetching, isError } =
		useTrendsOverview(period);

	const goToWorkouts = () => {
		navigate("/workouts");
	};

	const goToCategory = (category: TrendCategoryKey) => {
		navigate(`/trends/${category}?period=${period}`);
	};

	return (
		<PageContainer>
			<div className={styles.TrendsPage}>
				<div className={styles.TrendsPage_nav}>
					<NavArrows onBack={goToWorkouts} />
					{overview && (
						<span className={styles.TrendsPage_range}>
							{formatPeriodRange(overview.period)}
						</span>
					)}
				</div>
				<h1 className={styles.TrendsPage_title}>Trends</h1>
				<TrendPeriodSelector period={period} onChange={setPeriod} />

				<div className={styles.TrendsPage_main} data-fetching={isFetching}>
					{isLoading && (
						<Loader>
							<span>Loading your trends...</span>
						</Loader>
					)}
					{isError && !overview && (
						<NoData icon="empty" msg="Unable to load your trends right now." />
					)}
					{overview &&
						overview.cards.map((card) => (
							<TrendCategoryCard
								key={card.category}
								card={card}
								onClick={() => goToCategory(card.category)}
							/>
						))}
				</div>
			</div>
		</PageContainer>
	);
};

export default TrendsPage;
