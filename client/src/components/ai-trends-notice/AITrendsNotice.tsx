import { CSSProperties } from "react";
import { format, parseISO } from "date-fns";
import styles from "../../css/ai-trends-notice/AITrendsNotice.module.scss";
import { AILatestTrendNotice } from "../../features/ai-trends/types";
import {
	formatMetricChange,
	getMetricVariant,
	getNoticeMetricRows,
	getNoticeVariant,
	getNoticeWeekBars,
	NoticeMetricRow,
	NoticeVariant,
	NoticeWeekBar,
} from "../../utils/utils_aiTrends";
import FadeIn from "../ui/FadeIn";
import AnimatedTrendArrow from "../ui/AnimatedTrendArrow";

type Props = {
	notice: AILatestTrendNotice;
	onClose: () => void;
	onViewMore: () => void;
};

// Exposes the variant's colors to the SCSS as custom properties
const getVariantStyles = (
	variant: Pick<NoticeVariant, "color" | "bgColor">,
) => {
	return {
		"--notice-color": variant.color,
		"--notice-bg": variant.bgColor,
	} as CSSProperties;
};

const Header = ({ weekStart }: { weekStart: string }) => {
	const weekOf = format(parseISO(weekStart), "MMM do");
	return (
		<div className={styles.Header}>
			<span className={styles.Header_label}>Your weekly trends</span>
			<span className={styles.Header_date}>Week of {weekOf}</span>
		</div>
	);
};

type HeroProps = {
	title: string;
	message: string;
	variant: NoticeVariant;
};

const Hero = ({ title, message, variant }: HeroProps) => {
	return (
		<div className={styles.Hero}>
			<AnimatedTrendArrow
				size={50}
				direction={variant.arrow}
				gradient={variant.gradient}
			/>
			<h2 className={styles.Hero_title}>{title}</h2>
			<p className={styles.Hero_message}>{message}</p>
		</div>
	);
};

const MetricRow = ({ metric }: { metric: NoticeMetricRow }) => {
	const { label, prior, recent, decimals } = metric;
	const change = formatMetricChange(metric);
	const variantStyles = getVariantStyles(getMetricVariant(metric.direction));
	return (
		<div className={styles.MetricRow}>
			<span className={styles.MetricRow_label}>{label}</span>
			<span className={styles.MetricRow_values}>
				{prior.toFixed(decimals)} →{" "}
				<b className={styles.MetricRow_recent}>{recent.toFixed(decimals)}</b>
			</span>
			<span className={styles.MetricRow_change} style={variantStyles}>
				{change}
			</span>
		</div>
	);
};

const Metrics = ({ rows }: { rows: NoticeMetricRow[] }) => {
	return (
		<div className={styles.Metrics}>
			<h3 className={styles.SectionTitle}>Last 4 weeks vs the 4 before</h3>
			{rows.map((row) => (
				<MetricRow key={row.key} metric={row} />
			))}
		</div>
	);
};

const WeekBar = ({ bar }: { bar: NoticeWeekBar }) => {
	const css = { height: `${bar.height}%` };
	const className = bar.isRecent ? styles.WeekBar_recent : styles.WeekBar;
	const title = `Week of ${bar.weekStart}: ${bar.totalMins} mins`;
	return <div className={className} style={css} title={title} />;
};

const WeeklyMinutes = ({ bars }: { bars: NoticeWeekBar[] }) => {
	return (
		<div className={styles.WeeklyMinutes}>
			<h3 className={styles.SectionTitle}>Weekly minutes</h3>
			<div className={styles.WeeklyMinutes_bars}>
				{bars.map((bar) => (
					<WeekBar key={bar.weekStart} bar={bar} />
				))}
			</div>
			<div className={styles.WeeklyMinutes_labels}>
				<span>Prior 4 weeks</span>
				<span>Recent 4 weeks</span>
			</div>
		</div>
	);
};

type ActionsProps = {
	onClose: () => void;
	onViewMore: () => void;
};

const Actions = ({ onClose, onViewMore }: ActionsProps) => {
	return (
		<div className={styles.Actions}>
			<button type="button" className={styles.Actions_close} onClick={onClose}>
				Got it
			</button>
			<button
				type="button"
				className={styles.Actions_viewMore}
				onClick={onViewMore}
			>
				View trends
			</button>
		</div>
	);
};

const AITrendsNotice = ({ notice, onClose, onViewMore }: Props) => {
	const variant = getNoticeVariant(notice.direction);
	const metricRows = getNoticeMetricRows(notice.metrics);
	const weekBars = getNoticeWeekBars(notice.weeks);
	const hasWeeks = weekBars.length > 0;

	return (
		<FadeIn>
			<div className={styles.AITrendsNotice} style={getVariantStyles(variant)}>
				<Header weekStart={notice.weekStart} />
				<Hero title={notice.title} message={notice.message} variant={variant} />
				<Metrics rows={metricRows} />
				{hasWeeks && <WeeklyMinutes bars={weekBars} />}
				<Actions onClose={onClose} onViewMore={onViewMore} />
			</div>
		</FadeIn>
	);
};

export default AITrendsNotice;
