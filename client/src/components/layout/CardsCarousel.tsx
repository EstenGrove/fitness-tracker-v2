import React, { Children, RefObject } from "react";
import styles from "../../css/layout/CardsCarousel.module.scss";

type Props = {
	containerRef?: RefObject<HTMLDivElement | null>;
	children: React.ReactNode;
};

const CardsCarousel = ({ children, containerRef }: Props) => {
	return (
		<div ref={containerRef} className={styles.CardsCarousel}>
			<div className={styles.CardsCarousel_inner}>
				{Children.map(children, (child, idx) => (
					<div key={idx} className={styles.CardsCarousel_inner_card}>
						{child}
					</div>
				))}
			</div>
		</div>
	);
};

CardsCarousel.displayName = "CardsCarousel";

export default CardsCarousel;
