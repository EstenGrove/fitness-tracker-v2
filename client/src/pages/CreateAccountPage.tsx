import { useState } from "react";
import styles from "../css/pages/CreateAccountPage.module.scss";
import { CreateAccountValues } from "../features/user/types";
import CreateAccountForm from "../components/login/CreateAccountForm";
import { useNavigate } from "react-router";
import { AuthProvider } from "../features/auth/types";

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

	const onProviderSignup = (provider: AuthProvider) => {
		// do stuff
		console.log("[PROVIDER]:", provider.toUpperCase());
	};

	return (
		<div className={styles.CreateAccountPage}>
			<div className={styles.CreateAccountPage_header}>
				<h2>💪 Fitness Tracker (v2)</h2>
				<h4>Signup</h4>
			</div>
			<div className={styles.CreateAccountPage_form}>
				<CreateAccountForm
					values={values}
					onChange={onChange}
					onSubmit={onSubmit}
					goTo={() => navigate("/login")}
					onProviderSignup={onProviderSignup}
				/>
			</div>
		</div>
	);
};

export default CreateAccountPage;
