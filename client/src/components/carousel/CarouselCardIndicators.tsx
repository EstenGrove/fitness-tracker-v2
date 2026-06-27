import styles from "../../css/carousel/CarouselCardIndicators.module.scss";

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

const CarouselCardIndicators = ({
	total = 0,
	current = 0,
	onSelect,
}: CardIndicatorProps) => {
	const cards: number[] = [...Array(total).keys()]; // 0, 1, 2, 3....

	return (
		<div className={styles.CarouselCardIndicators}>
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

export default CarouselCardIndicators;
