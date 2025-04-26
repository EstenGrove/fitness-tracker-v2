import styles from "../../css/login/LoginForm.module.scss";
import { LoginValues } from "../../features/user/types";
import PasswordInput from "../shared/PasswordInput";
import TextInput from "../shared/TextInput";

type Props = {
	values: LoginValues;
	onChange: (name: string, value: string) => void;
	onSubmit: () => void;
	goTo: () => void;
};

const inputCss = {
	borderRadius: "1rem",
	height: "4rem",
	minWidth: "100%",
};

const LoginForm = ({ values, onChange, onSubmit, goTo }: Props) => {
	return (
		<form className={styles.LoginForm}>
			<div className={styles.LoginForm_username}>
				<label htmlFor="username">Username/Email</label>
				<TextInput
					name="username"
					id="username"
					value={values.username}
					onChange={onChange}
					// placeholder="my-email@gmail.com"
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
					// placeholder="my-email@gmail.com"
					style={inputCss}
				/>
			</div>
			<div className={styles.LoginForm_actions}>
				<button
					type="button"
					onClick={onSubmit}
					className={styles.LoginForm_actions_login}
				>
					Login
				</button>
				{/* <div className={styles.LoginForm_actions_or}>or</div> */}
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
