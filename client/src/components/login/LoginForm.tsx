import styles from "../../css/login/LoginForm.module.scss";
import { LoginValues } from "../../features/user/types";
import PasswordInput from "../shared/PasswordInput";
import TextInput from "../shared/TextInput";

type Props = {
	values: LoginValues;
	onChange: (name: string, value: string) => void;
	onSubmit: () => void;
	goTo: () => void;
	isLoading: boolean;
};

const inputCss = {
	borderRadius: "1rem",
	height: "4rem",
	minWidth: "100%",
};

const isValidEmail = (username: string): boolean => {
	const pattern = /^(\w{1,})(@)(\w{1,})/;
	const hasPattern = pattern.test(username);

	return hasPattern;
};

const enableLoginBtn = (values: LoginValues) => {
	const { username, password } = values;
	const hasPattern = isValidEmail(username);
	const hasVals = !!username && !!password;
	const hasLength = username.length > 5 && password.length > 5;

	return hasVals && hasPattern && hasLength;
};

const LoginForm = ({
	values,
	onChange,
	onSubmit,
	goTo,
	isLoading = false,
}: Props) => {
	const canSubmit = enableLoginBtn(values);
	return (
		<form className={styles.LoginForm}>
			<div className={styles.LoginForm_username}>
				<label htmlFor="username">Username/Email</label>
				<TextInput
					name="username"
					id="username"
					value={values.username}
					onChange={onChange}
					style={inputCss}
				/>
			</div>
			<div className={styles.LoginForm_password}>
				<label htmlFor="password">Password</label>
				<PasswordInput
					name="password"
					id="password"
					value={values.password}
					onChange={onChange}
					style={inputCss}
				/>
			</div>
			<div className={styles.LoginForm_actions}>
				<button
					type="button"
					onClick={onSubmit}
					disabled={!canSubmit || isLoading}
					className={styles.LoginForm_actions_login}
				>
					{isLoading ? "Submitting..." : "Login"}
				</button>
				<button
					type="button"
					onClick={goTo}
					className={styles.LoginForm_actions_account}
				>
					Create Account
				</button>
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</form>
	);
};

export default LoginForm;
