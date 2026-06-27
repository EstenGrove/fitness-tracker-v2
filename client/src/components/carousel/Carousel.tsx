import { useRef, useState, type ReactElement } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import styles from "../../css/carousel/Carousel.module.scss";
import type {
	CarouselCard,
	CarouselSlide,
	MappedCarouselCard,
} from "../../utils/utils_carousel";
import FadeIn from "../ui/FadeIn";
import CarouselTop from "./CarouselTop";
import CardsCarousel from "./CardsCarousel";
import CarouselCardIndicators from "./CarouselCardIndicators";

type BaseProps = {
	title: string;
	subtitle?: string;
	onClose: () => void;
};

type HomogeneousProps<TData> = BaseProps & {
	cards: CarouselCard<TData>[];
};

type MappedProps<TDataMap extends Record<string, unknown>> = BaseProps & {
	cards: MappedCarouselCard<TDataMap>[];
};

function Carousel<TData>(props: HomogeneousProps<TData>): ReactElement;
function Carousel<TDataMap extends Record<string, unknown>>(
	props: MappedProps<TDataMap>,
): ReactElement;
function Carousel({
	title = "Carousel",
	subtitle = "January 1 - 31, 2026",
	cards = [],
	onClose,
}: HomogeneousProps<unknown> | MappedProps<Record<string, unknown>>) {
	const slides = cards as CarouselSlide[];
	useLockBodyScroll();
	const carouselRef = useRef<HTMLDivElement>(null);
	const [currentStep, setCurrentStep] = useState(0);

	// Card indicator buttons & tap-zones
	// - When we scrollTo a card's position the 'onScroll' fires thus syncing to currentStep
	const goToCard = (card: number) => {
		if (!carouselRef.current) return;

		const carousel = carouselRef.current as HTMLDivElement;

		const width = carousel.clientWidth;
		const clamped = Math.max(0, Math.min(card, slides.length - 1));

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
		const card = Math.min(slides.length, next);
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
		<div className={styles.Carousel}>
			<CarouselTop title={title} onClose={onClose} dates={subtitle}>
				<CarouselCardIndicators
					current={currentStep}
					total={slides.length}
					onSelect={goToCard}
				/>
			</CarouselTop>
			<CardsCarousel
				carouselRef={carouselRef}
				onSwipe={onScroll}
				onPrev={onTapPrev}
				onNext={onTapNext}
			>
				{slides.map((card, idx) => {
					const Card = card.render;
					return (
						<div key={idx + "-" + card.id} className={styles.slide}>
							<FadeIn>
								<Card data={card.data} isActive={idx === currentStep} />
							</FadeIn>
						</div>
					);
				})}
			</CardsCarousel>
		</div>,
		document.body,
	);
}

export default Carousel;
