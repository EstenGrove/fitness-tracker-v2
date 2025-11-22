import { useMemo } from "react";
import styles from "../../css/login/CreateAccountForm.module.scss";
import { CreateAccountValues } from "../../features/user/types";
import PasswordInput from "../shared/PasswordInput";
import TextInput from "../shared/TextInput";
import GoogleAuthButton from "../third-party/GoogleAuthButton";
import { AuthProvider } from "../../features/auth/types";

type Props = {
	values: CreateAccountValues;
	onChange: (name: string, value: string) => void;
	onSubmit: () => void;
	onProviderSignup: (provider: AuthProvider) => void;
	goTo: () => void;
	isSubmitting: boolean;
};

const inputCss = {
	borderRadius: "1rem",
	height: "4rem",
	minWidth: "100%",
};

type ValidationSchema<T extends object> = {
	[K in keyof T]: (values: T) => boolean;
};

type ValuesToCheck = Omit<CreateAccountValues, "rememberMe">;

const formSchema: ValidationSchema<ValuesToCheck> = {
	username: (values: ValuesToCheck) => {
		const value = values.username;
		const reg = /^(?<before>[\w._-\d]{1,})(?<at>@{1})(?<domain>(\w|.){1,})/gm;
		if (!value || value === "" || value.length <= 5) return false;
		return reg.test(value);
	},
	password: (values: ValuesToCheck) => {
		const value = values.password;
		const reg = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/gm;
		if (!value || value === "" || value.length <= 5) return false;
		return reg.test(value);
	},
	passwordConfirm: (values: ValuesToCheck) => {
		const value = values.passwordConfirm;
		const otherValue = values.password;
		if (!value || value === "" || value.length <= 5) return false;
		return value === otherValue;
	},
};

const validateValues = <T extends object>(
	values: T,
	schema: ValidationSchema<T>
) => {
	let areAllValid = true;
	const keys = Object.keys(values) as Array<keyof T>;
	const results = keys.reduce((all, key) => {
		// If no schema/validator for a key, then bail on it
		if (!(key in schema)) {
			all[key as keyof object] = true;
		}

		if (!all[key as keyof object]) {
			const isValid = schema[key](values);
			all[key as keyof object] = isValid;
			if (!isValid) areAllValid = false;
		}
		return all;
	}, {} as Record<string, boolean>);

	return { isValid: areAllValid, results };
};

const formIsFilled = <T extends object>(
	values: T,
	keysToCheck: (keyof T)[]
) => {
	const allValid = keysToCheck.every((key) => {
		const val = values[key];
		return !!val && val !== "";
	});

	return allValid;
};

const CreateAccountForm = ({
	values,
	onChange,
	onSubmit,
	onProviderSignup,
	goTo,
	isSubmitting = false,
}: Props) => {
	const isValidated = useMemo(() => {
		const isFilled = formIsFilled(values, [
			"username",
			"password",
			"passwordConfirm",
		]);
		const { isValid, results } = validateValues(values, formSchema);
		console.log("[RESULTS]: ", results);

		return {
			isValid: isFilled && isValid,
			results: results,
		};
	}, [values]);
	const { isValid, results } = isValidated;

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
					isInvalid={results.username === false}
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
					isInvalid={!results.password}
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
					isInvalid={!results.passwordConfirm}
				/>
			</div>
			<div className={styles.CreateAccountForm_actions}>
				<button
					type="button"
					onClick={onSubmit}
					disabled={!isValid || isSubmitting}
					className={styles.CreateAccountForm_actions_login}
				>
					{isSubmitting ? "Submitting..." : "Create Account"}
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
			<div className={styles.CreateAccountForm_thirdParty}>
				<div className={styles.CreateAccountForm_thirdParty_or}>
					<div>OR</div>
				</div>
				<div className={styles.CreateAccountForm_thirdParty_buttons}>
					<GoogleAuthButton onClick={() => onProviderSignup("google")}>
						Signup with Google
					</GoogleAuthButton>
				</div>
			</div>
		</form>
	);
};

export default CreateAccountForm;
