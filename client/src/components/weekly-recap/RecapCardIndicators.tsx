import styles from "../../css/weekly-recap/RecapCardIndicators.module.scss";

type Props = {
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

const RecapCardIndicators = ({ total = 7, current = 0, onSelect }: Props) => {
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

export default RecapCardIndicators;
