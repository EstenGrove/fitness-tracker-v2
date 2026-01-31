import { ReactNode, useMemo, useRef, useState } from "react";
import sprite from "../../assets/icons/dashboard.svg";
import styles from "../../css/workout-recaps/WorkoutRecap.module.scss";
import { createPortal } from "react-dom";
import { Activity } from "../../features/shared/types";
import { getLastXDaysRange } from "../../utils/utils_dates";
import { ActivityRecapsCardProps } from "../../features/recaps/types";
import { getRangeDesc } from "../../utils/utils_weeklyRecap";
import { getActivityRecapCards } from "../../utils/utils_recaps";
import { useWorkoutRecap } from "../../hooks/useWorkoutRecap";

import FadeIn from "../ui/FadeIn";
import RecapsCarousel from "../recaps-carousel/RecapsCarousel";

type Props = {
	workoutID: number;
	activityType: Activity;
	lastXDays?: number;
	onClose: () => void;
};

// the rendered UI card type
type WorkoutCard = React.ComponentType<ActivityRecapsCardProps<Activity>>;

type CardIndicatorProps = {
	total: number;
	current: number;
	onSelect: (card: number) => void;
};

type IndicatorBtnProps = {
	hasViewed: boolean;
	onClick: () => void;
};
const IndicatorButton = ({ onClick, hasViewed = false }: IndicatorBtnProps) => {
	const css = {
		backgroundColor: hasViewed ? "var(--blueGrey600)" : "var(--blueGrey700)",
		opacity: hasViewed ? 1 : 0.3,
		transition: "background-color 0.2s ease-in, opacity .2s ease-in",
	};
	return (
		<button
			onClick={onClick}
			className={styles.IndicatorButton}
			style={css}
			data-hasviewed={hasViewed}
		></button>
	);
};

const CardIndicators = ({
	total = 0,
	current = 0,
	onSelect,
}: CardIndicatorProps) => {
	const cards: number[] = [...Array(total).keys()]; // 0, 1, 2, 3....

	return (
		<div className={styles.CardIndicators}>
			{cards &&
				cards.map((card) => {
					const hasViewed = card <= current;
					return (
						<IndicatorButton
							key={card}
							hasViewed={hasViewed}
							onClick={() => onSelect(card)}
						/>
					);
				})}
		</div>
	);
};

type CarouselTopProps = {
	title: string;
	dates: string;
	children?: ReactNode;
	onClose: () => void;
};

const TitleSection = ({
	title = "Weekly Recap",
	dates = "December 21 - 29, 2025",
}: {
	title: string;
	dates: string;
}) => {
	return (
		<div className={styles.TitleSection}>
			<div className={styles.TitleSection_title}>{title}</div>
			<div className={styles.TitleSection_dates}>{dates}</div>
		</div>
	);
};

const CarouselTop = ({ title, dates, children, onClose }: CarouselTopProps) => {
	return (
		<div className={styles.CarouselTop}>
			<div className={styles.CarouselTop_indicators}>{children}</div>
			<div className={styles.CarouselTop_other}>
				<div className={styles.CarouselTop_about}>
					<TitleSection title={title} dates={dates} />
				</div>
				<button
					type="button"
					onClick={onClose}
					className={styles.CarouselTop_close}
				>
					<svg className={styles.CarouselTop_close_icon}>
						<use xlinkHref={`${sprite}#icon-clear`}></use>
					</svg>
				</button>
			</div>
		</div>
	);
};

const getTopTitle = (type: Activity) => {
	switch (type) {
		case "Strength": {
			return "Strength Training";
		}
		case "Stretch": {
			return "Stretch Workouts";
		}
		case "Cardio": {
			return "Cardio Workouts";
		}
		case "Walk": {
			return "Walk Workouts";
		}
		case "Other":
		case "Timed": {
			return type + " " + "Workouts";
		}

		default:
			return "Workout Recap";
	}
};

const getDatesRangeAndDesc = (lastXDays: number = 30) => {
	const dateRange = getLastXDaysRange(lastXDays);
	const rangeDesc = getRangeDesc(dateRange);

	return {
		range: dateRange,
		desc: rangeDesc,
	};
};

const WorkoutRecap = ({
	workoutID,
	activityType,
	onClose,
	lastXDays = 30,
}: Props) => {
	const topTitle = getTopTitle(activityType);
	const carouselRef = useRef<HTMLDivElement>(null);
	const [currentStep, setCurrentStep] = useState(0);
	const { desc } = getDatesRangeAndDesc(lastXDays);
	const { data } = useWorkoutRecap({
		activityType: activityType,
		workoutID: workoutID,
		lastXDays: lastXDays,
	});
	const cards = useMemo(() => {
		return getActivityRecapCards(activityType, data);
	}, [activityType, data]);

	console.log("data", data);
	console.log("cards", cards);
	// Card indicator buttons & tap-zones
	// - When we scrollTo a card's position the 'onScroll' fires thus syncing to currentStep
	const goToCard = (card: number) => {
		if (!carouselRef.current) return;

		const carousel = carouselRef.current as HTMLDivElement;

		const width = carousel.clientWidth;
		const clamped = Math.max(0, Math.min(card, cards.length - 1));

		carousel.scrollTo({
			left: clamped * width,
			behavior: "smooth",
		});
	};

	// tap to go back
	const onTapPrev = () => {
		const prev = currentStep - 1;
		const card = Math.max(prev, 0);
		goToCard(card);
	};
	// tap to go forward
	const onTapNext = () => {
		const next = currentStep + 1;
		const card = Math.min(cards.length, next);
		goToCard(card);
	};

	// When user scrolls/swipes between cards (eg. horizontal scroll)
	const onScroll = () => {
		if (!carouselRef.current) return;

		const carousel = carouselRef.current as HTMLDivElement;

		const width = carousel.clientWidth;
		const index = Math.round(carousel.scrollLeft / width);

		setCurrentStep(index);
	};

	return createPortal(
		<div className={styles.WorkoutRecap}>
			<CarouselTop title={topTitle} onClose={onClose} dates={desc}>
				<CardIndicators
					current={currentStep}
					total={cards.length}
					onSelect={goToCard}
				/>
			</CarouselTop>
			<RecapsCarousel
				onSwipe={onScroll}
				onPrev={onTapPrev}
				onNext={onTapNext}
				carouselRef={carouselRef}
			>
				{cards?.length &&
					cards.map((card, idx) => {
						const Card = card.render as WorkoutCard;
						return (
							<div key={idx + "-" + card.id} className={styles.slide}>
								<FadeIn>
									<Card data={card.data} isActive={idx === currentStep} />
								</FadeIn>
							</div>
						);
					})}
			</RecapsCarousel>
		</div>,
		document.body
	);
};

export default WorkoutRecap;
