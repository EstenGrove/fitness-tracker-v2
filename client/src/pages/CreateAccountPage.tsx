import { useState } from "react";
import styles from "../css/pages/CreateAccountPage.module.scss";
import { CreateAccountValues } from "../features/user/types";
import CreateAccountForm from "../components/login/CreateAccountForm";
import { useNavigate } from "react-router";
import { AuthProvider } from "../features/auth/types";
import { useGoogleAuth } from "../hooks/useGoogleAuth";
import { useAppDispatch } from "../store/store";
import { signupUserWithGoogle } from "../features/user/operations";
import { setAccessTokenCookie } from "../utils/utils_cookies";

interface ErrorInfo {
	error: string | null | undefined;
	key: number;
}

const CreateAccountPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
	const [error, setError] = useState<ErrorInfo>({ error: null, key: 0 });
	const [values, setValues] = useState<CreateAccountValues>({
		username: "",
		password: "",
		passwordConfirm: "",
		rememberMe: false,
	});
	const { signin: signupWithGoogle } = useGoogleAuth({
		onSuccess: async (token) => {
			const signupData = await dispatch(
				signupUserWithGoogle({ token })
			).unwrap();

			if (signupData && signupData?.user) {
				const userToken = signupData.token as string;
				setAccessTokenCookie(userToken);
				setIsSubmitting(false);
				navigate("/");
			} else {
				console.log("❌ [ERROR]: ", signupData?.error);
			}
		},
		onError: (err) => {
			setIsSubmitting(false);
			setError({
				error: err?.toString(),
				key: error.key + 1,
			});
		},
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
		switch (provider) {
			case "google": {
				setIsSubmitting(true);
				return signupWithGoogle();
			}
			case "apple": {
				setIsSubmitting(true);
				return;
			}
			default:
				break;
		}
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
					isSubmitting={isSubmitting}
					goTo={() => navigate("/login")}
					onProviderSignup={onProviderSignup}
				/>
			</div>
		</div>
	);
};

export default CreateAccountPage;
