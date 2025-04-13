import { useNavigate } from "react-router";
import styles from "../css/pages/NotFoundPage.module.scss";

const NotFoundPage = () => {
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	return (
		<div className={styles.NotFoundPage}>
			<h2>Page Not Found!</h2>
			<button
				type="button"
				onClick={goBack}
				className={styles.NotFoundPage_goBack}
			>
				Go back
			</button>
		</div>
	);
};

export default NotFoundPage;
