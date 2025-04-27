import { useState } from "react";
import styles from "../css/pages/CreateAccountPage.module.scss";
import { CreateAccountValues } from "../features/user/types";
import CreateAccountForm from "../components/login/CreateAccountForm";
import { useNavigate } from "react-router";

const CreateAccountPage = () => {
	const navigate = useNavigate();
	const [values, setValues] = useState<CreateAccountValues>({
		username: "",
		password: "",
		passwordConfirm: "",
		rememberMe: false,
	});

	const onChange = (name: string, value: string) => {
		setValues({
			...values,
			[name]: value,
		});
	};

	const onSubmit = () => {
		// login
		navigate("/");
	};

	return (
		<div className={styles.CreateAccountPage}>
			<div className={styles.CreateAccountPage_header}>
				<h2>💪 Fitness Tracker (v2)</h2>
			</div>
			<div className={styles.CreateAccountPage_form}>
				<CreateAccountForm
					values={values}
					onChange={onChange}
					onSubmit={onSubmit}
					goTo={() => navigate("/login")}
				/>
			</div>
		</div>
	);
};

export default CreateAccountPage;
