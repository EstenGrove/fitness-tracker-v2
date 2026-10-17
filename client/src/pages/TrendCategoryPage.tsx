import sprite from "../assets/icons/calendar.svg";
import styles from "../css/pages/TrendCategoryPage.module.scss";
import { useNavigate, useParams } from "react-router";
import {
	TREND_CATEGORIES,
	TrendCategoryConfig,
} from "../features/trends-hub/categories";
import { TrendCategoryData } from "../features/trends-hub/types";
import { useTrendPeriod } from "../hooks/useTrendPeriod";
import { useTrendCategory } from "../hooks/useTrendCategory";
import {
	formatPeriodRange,
	isTrendCategoryKey,
} from "../utils/utils_trendsHub";
import NavArrows from "../components/layout/NavArrows";
import PageContainer from "../components/layout/PageContainer";
import Loader from "../components/layout/Loader";
import NoData from "../components/ui/NoData";
import TrendPeriodSelector from "../components/trends-hub/TrendPeriodSelector";
import TrendCategoryIcon from "../components/trends-hub/TrendCategoryIcon";
import TrendKpiGrid from "../components/trends-details/TrendKpiGrid";
import TrendChart from "../components/trends-details/TrendChart";
import TrendInsightsList from "../components/trends-details/TrendInsightsList";
import TrendBreakdownList from "../components/trends-details/TrendBreakdownList";

// A trends category's detail page (/trends/:category). Every category uses this same template;
// what's shown per category comes from 'TREND_CATEGORIES' (features/trends-hub/categories.ts).

type DetailsProps = {
	data: TrendCategoryData;
	config: TrendCategoryConfig;
	onViewHistory: () => void;
};

const CategoryDetails = ({ data, config, onViewHistory }: DetailsProps) => {
	return (
		<>
			<TrendKpiGrid kpis={data.kpis} />
			{config.charts.map((chart) => (
				<TrendChart
					key={chart.key}
					title={chart.title}
					kind={chart.kind}
					series={chart.select(data.series)}
				/>
			))}
			<TrendInsightsList insights={data.insights} />
			{data.breakdowns.map((breakdown) => (
				<TrendBreakdownList key={breakdown.key} breakdown={breakdown} />
			))}
			<button
				type="button"
				className={styles.HistoryLink}
				onClick={onViewHistory}
			>
				<span>{config.history.label}</span>
				<svg className={styles.HistoryLink_icon} aria-hidden="true">
					<use xlinkHref={`${sprite}#icon-arrow_right`}></use>
				</svg>
			</button>
		</>
	);
};

const TrendCategoryPage = () => {
	const navigate = useNavigate();
	const params = useParams();
	const category = isTrendCategoryKey(params.category) ? params.category : null;
	const config = category ? TREND_CATEGORIES[category] : null;
	const { period, setPeriod } = useTrendPeriod();
	const { categoryData, isLoading, isFetching, isError } = useTrendCategory(
		category,
		period,
	);
	const headlineTone = categoryData?.kpis[0]?.tone ?? "NEUTRAL";

	const goToHub = () => {
		navigate(`/trends?period=${period}`);
	};

	const goToHistory = () => {
		if (!config) return;
		navigate(config.history.path);
	};

	if (!config) {
		return (
			<PageContainer>
				<div className={styles.TrendCategoryPage}>
					<NavArrows onBack={goToHub} />
					<NoData icon="empty" msg="That trends category doesn't exist." />
				</div>
			</PageContainer>
		);
	}

	return (
		<PageContainer>
			<div className={styles.TrendCategoryPage}>
				<div className={styles.TrendCategoryPage_nav}>
					<NavArrows onBack={goToHub} />
					{categoryData && (
						<span className={styles.TrendCategoryPage_range}>
							{formatPeriodRange(categoryData.period)}
						</span>
					)}
				</div>
				<div className={styles.TrendCategoryPage_header}>
					<TrendCategoryIcon icon={config.icon} tone={headlineTone} />
					<h1 className={styles.TrendCategoryPage_title}>{config.title}</h1>
				</div>
				<TrendPeriodSelector period={period} onChange={setPeriod} />

				<div
					className={styles.TrendCategoryPage_main}
					data-fetching={isFetching}
				>
					{isLoading && (
						<Loader>
							<span>Loading {config.title.toLowerCase()}...</span>
						</Loader>
					)}
					{isError && !categoryData && (
						<NoData
							icon="empty"
							msg="Unable to load this category right now."
						/>
					)}
					{categoryData && (
						<CategoryDetails
							data={categoryData}
							config={config}
							onViewHistory={goToHistory}
						/>
					)}
				</div>
			</div>
		</PageContainer>
	);
};

export default TrendCategoryPage;
