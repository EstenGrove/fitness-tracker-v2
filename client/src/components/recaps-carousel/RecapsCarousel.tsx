import React, { ReactNode, RefObject, useRef } from "react";
import styles from "../../css/recaps-carousel/RecapsCarousel.module.scss";

type Props = {
	carouselRef: RefObject<HTMLDivElement | null>;
	onSwipe: () => void;
	onPrev: () => void;
	onNext: () => void;
	children?: ReactNode;
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

const RecapsCarousel = ({
	carouselRef,
	onPrev,
	onNext,
	onSwipe,
	children,
}: Props) => {
	return (
		<div ref={carouselRef} onScroll={onSwipe} className={styles.RecapsCarousel}>
			{children}

			<TapZones onPrev={onPrev} onNext={onNext} />
		</div>
	);
};

export default RecapsCarousel;
