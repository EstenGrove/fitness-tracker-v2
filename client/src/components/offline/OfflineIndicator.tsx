import { useContext } from "react";
import styles from "../../css/offline/OfflineIndicator.module.scss";
import { OfflineContext } from "../../context/OfflineContext";

const OfflineIndicator = () => {
	const offline = useContext(OfflineContext);
	const isOffline = offline.isOffline;

	if (!isOffline) {
		return null;
	}
	return (
		<div className={styles.OfflineIndicator}>
			Network connection issue. Please refresh.
		</div>
	);
};

export default OfflineIndicator;
