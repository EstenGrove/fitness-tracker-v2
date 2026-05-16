import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import styles from "../../css/carousel/Carousel.module.scss";
import FadeIn from "../ui/FadeIn";
import CarouselTop from "./CarouselTop";
import CardsCarousel from "./CardsCarousel";
import CarouselCardIndicators from "./CarouselCardIndicators";

interface CardProps {
	[key: string]: unknown;
	isActive: boolean;
}

export interface CarouselCard {
	id: number;
	data: Record<string, unknown>;
	render: React.ComponentType<CardProps>;
}

type Props = {
	title: string;
	subtitle?: string;
	cards: CarouselCard[];
	onClose: () => void;
};

const Carousel = ({
	title = "Carousel",
	subtitle = "January 1 - 31, 2026",
	cards = [],
	onClose,
}: Props) => {
	useLockBodyScroll();
	const carouselRef = useRef<HTMLDivElement>(null);
	const [currentStep, setCurrentStep] = useState(0);

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
		<div className={styles.Carousel}>
			<CarouselTop title={title} onClose={onClose} dates={subtitle}>
				<CarouselCardIndicators
					current={currentStep}
					total={cards.length}
					onSelect={goToCard}
				/>
			</CarouselTop>
			<CardsCarousel
				carouselRef={carouselRef}
				onSwipe={onScroll}
				onPrev={onTapPrev}
				onNext={onTapNext}
			>
				{cards.map((card, idx) => {
					const Card = card.render as React.ComponentType<CardProps>;
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
};

export default Carousel;
