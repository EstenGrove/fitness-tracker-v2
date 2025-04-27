import styles from "../../css/login/CreateAccountForm.module.scss";
import { CreateAccountValues } from "../../features/user/types";
import PasswordInput from "../shared/PasswordInput";
import TextInput from "../shared/TextInput";

type Props = {
	values: CreateAccountValues;
	onChange: (name: string, value: string) => void;
	onSubmit: () => void;
	goTo: () => void;
};

const inputCss = {
	borderRadius: "1rem",
	height: "4rem",
	minWidth: "100%",
};

const CreateAccountForm = ({ values, onChange, onSubmit, goTo }: Props) => {
	return (
		<form className={styles.CreateAccountForm}>
			<div className={styles.CreateAccountForm_username}>
				<label htmlFor="username">Enter username or email</label>
				<TextInput
					name="username"
					id="username"
					value={values.username}
					onChange={onChange}
					placeholder="Enter a username or email..."
					style={inputCss}
				/>
			</div>
			<div className={styles.CreateAccountForm_password}>
				<label htmlFor="password">Create a password</label>
				<PasswordInput
					name="password"
					id="password"
					value={values.password}
					onChange={onChange}
					placeholder="Enter a password..."
					style={inputCss}
				/>
			</div>
			<div className={styles.CreateAccountForm_password}>
				<label htmlFor="passwordConfirm">Re-enter password</label>
				<PasswordInput
					name="passwordConfirm"
					id="passwordConfirm"
					value={values.passwordConfirm}
					onChange={onChange}
					placeholder="Confirm password..."
					style={inputCss}
				/>
			</div>
			<div className={styles.CreateAccountForm_actions}>
				<button
					type="button"
					onClick={onSubmit}
					className={styles.CreateAccountForm_actions_login}
				>
					Create Account
				</button>
				<div className={styles.CreateAccountForm_actions_haveAccount}>
					Already have an account?
				</div>
				<button
					type="button"
					onClick={goTo}
					className={styles.CreateAccountForm_actions_account}
				>
					Login
				</button>
				{/*  */}
				{/*  */}
				{/*  */}
			</div>
		</form>
	);
};

export default CreateAccountForm;
