import { useState } from "react";
import LoginForm from "../components/login/LoginForm";
import styles from "../css/pages/LoginPage.module.scss";
import { LoginValues } from "../features/user/types";
import { useNavigate } from "react-router";

const LoginPage = () => {
	const navigate = useNavigate();
	const [values, setValues] = useState<LoginValues>({
		username: "",
		password: "",
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
		<div className={styles.LoginPage}>
			<div className={styles.LoginPage_header}>
				<h2>💪 Fitness Tracker (v2)</h2>
			</div>
			<div className={styles.LoginPage_form}>
				<LoginForm
					values={values}
					onChange={onChange}
					onSubmit={onSubmit}
					goTo={() => navigate("/account")}
				/>
			</div>
			{/*  */}
			{/*  */}
			{/*  */}
		</div>
	);
};

export default LoginPage;
