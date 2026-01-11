import { useMemo, useRef, useState } from "react";
import styles from "../../css/weekly-recap/WeeklyRecap.module.scss";
import { subDays } from "date-fns";
import { WeeklyRecaps } from "../../features/recaps/types";
import { useSelector } from "react-redux";
import { RangeParams } from "../../features/types";
import { formatDate } from "../../utils/utils_dates";
import { CurrentUser } from "../../features/user/types";
import { getRangeDesc } from "../../utils/utils_weeklyRecap";
import { selectCurrentUser } from "../../features/user/userSlice";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useGetWeeklyRecaps } from "../../hooks/useGetWeeklyRecaps";
import FadeIn from "../ui/FadeIn";
import RecapCardTop from "./RecapCardTop";
import RecapTitleCard from "./RecapTitleCard";
import RecapStepsCard from "./RecapStepsCard";
import RecapCardLayout from "./RecapCardLayout";
import RecapStreakCard from "./RecapStreakCard";
import RecapStrengthCard from "./RecapStrengthCard";
import RecapCompletedCard from "./RecapCompletedCard";
import RecapCardIndicators from "./RecapCardIndicators";
import RecapActivitiesCard from "./RecapActivitiesCard";
import RecapTopActivitiesCard from "./RecapTopActivitiesCard";

type Props = {
	onClose: () => void;
	dateRange: RangeParams;
};

// FULL PAGE CARDS CAROUSEL

// 1st: User's weekly recap (December 21-27)
// 2nd: # of perfect workout days (eg days where all scheduled workouts were completed) w/ a data viz at the bottom
// 3rd: # of completed workouts in the week with a calendar grid data viz at the bottom
// 4th: Walk card: 'You walked 15.12 miles in 6h 23m'
// 5th: Strength card: 'You did 1h 31m of strength training. You broke your previous workout record!'
// 6th: <activity-type> card
// 7th: Summary card: a summary of the week's workouts & efforts

const defaultRange = {
	startDate: formatDate(subDays(new Date(), 7), "db"),
	endDate: formatDate(new Date(), "db"),
};

const getCards = (data: WeeklyRecaps) => {
	const titleCard = {
		id: 0,
		type: "Title",
		data: null,
	};
	const completedCard = {
		id: 1,
		type: "Completed",
		data: data,
	};
	const streakCard = {
		id: 2,
		type: "Streak",
		data: data,
	};
	const stepsCard = {
		id: 3,
		type: "Steps",
		data: data,
	};
	const strengthCard = {
		id: 4,
		type: "Strength",
		data: data,
	};
	const activityCard = {
		id: 5,
		type: "Activity",
		data: data,
	};

	return [
		titleCard,
		completedCard,
		streakCard,
		stepsCard,
		strengthCard,
		activityCard,
	];
};

const getTitle = (currentUser: CurrentUser) => {
	return `${currentUser?.firstName}'s Weekly Recap`;
};

type CardType =
	| "Title"
	| "Completed"
	| "Streak"
	| "Steps"
	| "Strength"
	| "Top"
	| "Activity"
	| "Standard";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type CardsMap = Record<CardType, React.ComponentType<any>>;
const cardsMap: CardsMap = {
	Title: RecapTitleCard,
	Completed: RecapCompletedCard,
	Streak: RecapStreakCard,
	Standard: RecapCardLayout,
	Steps: RecapStepsCard,
	Strength: RecapStrengthCard,
	Top: RecapTopActivitiesCard,
	Activity: RecapActivitiesCard,
};

type TapZoneProps = {
	onPrev: () => void;
	onNext: () => void;
};

const TapZones = ({ onPrev, onNext }: TapZoneProps) => {
	const startX = useRef<number | null>(null);

	const onPointerDown = (e: React.PointerEvent) => {
		startX.current = e.clientX;
	};

	const onPointerUp = (e: React.PointerEvent) => {
		if (startX.current == null) return;

		const dx = Math.abs(e.clientX - startX.current);
		startX.current = null;

		// If finger moved → this was a swipe, ignore
		if (dx > 10) return;

		const isLeft = e.clientX < window.innerWidth / 2;

		return isLeft ? onPrev() : onNext();
	};

	return (
		<div className={styles.TapZones}>
			<div
				className={styles.leftZone}
				onClick={onPrev}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
			/>
			<div
				className={styles.rightZone}
				onClick={onNext}
				onPointerDown={onPointerDown}
				onPointerUp={onPointerUp}
			/>
		</div>
	);
};

const WeeklyRecap = ({ dateRange = defaultRange, onClose }: Props) => {
	const { data } = useGetWeeklyRecaps(dateRange);
	const currentUser = useSelector(selectCurrentUser);
	const carouselRef = useRef<HTMLDivElement>(null);
	const [currentStep, setCurrentStep] = useState<number>(0);
	useLockBodyScroll();

	const dates = getRangeDesc(dateRange);
	const title = getTitle(currentUser);
	const showTitleInfo = currentStep > 0;

	const cards = useMemo(() => {
		if (!data) return [];
		return getCards(data);
	}, [data]);

	console.log("data", data);

	// Card indicator buttons & tap-zones
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

	// When user scrolls/swipes between cards (eg. horizontal scroll)
	const onScroll = () => {
		if (!carouselRef.current) return;

		const carousel = carouselRef.current as HTMLDivElement;

		const width = carousel.clientWidth;
		const index = Math.round(carousel.scrollLeft / width);

		setCurrentStep(index);
	};

	const onTapPrev = () => {
		const prev = currentStep - 1;
		const card = Math.max(prev, 0);
		goToCard(card);
	};
	const onTapNext = () => {
		const next = currentStep + 1;
		const card = Math.min(cards.length, next);
		goToCard(card);
	};

	return (
		<div className={styles.WeeklyRecap}>
			<RecapCardTop
				onClose={onClose}
				title={showTitleInfo ? title : ""}
				dates={showTitleInfo ? dates : ""}
			>
				<RecapCardIndicators
					total={7}
					current={currentStep}
					onSelect={goToCard}
				/>
			</RecapCardTop>
			<div
				className={styles.WeeklyRecap_carousel}
				ref={carouselRef}
				onScroll={onScroll}
			>
				{cards?.length > 0 &&
					cards.map((card, idx) => {
						const Card = cardsMap[card.type as keyof CardsMap];
						return (
							<div key={idx + "-" + card.id} className={styles.slide}>
								<FadeIn duration={650}>
									<Card
										isActive={idx === currentStep}
										dateRange={dateRange}
										data={card.data}
									/>
								</FadeIn>
							</div>
						);
					})}
				<TapZones onNext={onTapNext} onPrev={onTapPrev} />
			</div>
		</div>
	);
};

export default WeeklyRecap;
