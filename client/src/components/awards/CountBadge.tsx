import styles from "../../css/awards/CountBadge.module.scss";

interface Props {
	count: number;
	outOf: number;
}

const CountBadge = ({ count, outOf }: Props) => {
	return (
		<div className={styles.CountBadge}>
			<span className={styles.CountBadge_count}>{count}</span>
			<span className={styles.CountBadge_separator}>/</span>
			<span className={styles.CountBadge_outOf}>{outOf}</span>
		</div>
	);
};

export default CountBadge;
