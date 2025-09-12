import { startTransition, useState } from "react";
import styles from "../css/pages/LoginPage.module.scss";
import sprite from "../assets/icons/calendar.svg";
import { LoginValues } from "../features/user/types";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store/store";
import { loginUser } from "../features/user/operations";
import { fetchUserExists, UserExistsResponse } from "../utils/utils_user";
import { AwaitedResponse } from "../features/types";
import { setAccessTokenCookie } from "../utils/utils_cookies";
import { sleep } from "../utils/utils_requests";
import FadeIn from "../components/ui/FadeIn";
import LoginForm from "../components/login/LoginForm";
import SelfDestruct from "../components/ui/SelfDestruct";

// ##TODO:
// - Update 'isSubmitting' handling to use 'useTransition'
// - This should prevent the loading state from flipping back to false before navigating, meaning the loading state will persist until a navigation occurs, not before.

enum ELoginErrors {
	INVALID_CREDENTIALS = "Invalid Credentials",
	USER_NOT_FOUND = "Account not found",
	SERVER_ERROR = "Server issue occurred. Please try again.",
}

const ErrorMsg = ({ msg }: { msg: string }) => {
	return (
		<SelfDestruct expiry={6000}>
			<FadeIn duration={650}>
				<div className={styles.ErrorMsg}>
					<svg className={styles.ErrorMsg_icon}>
						<use xlinkHref={`${sprite}#icon-error_outline`}></use>
					</svg>
					<span>{msg}</span>
				</div>
			</FadeIn>
		</SelfDestruct>
	);
};

const getFailedLoginMsg = (data: UserExistsResponse) => {
	const isActive = data.isActiveUser;
	const invalidCreds = data.invalidCreds;
	const notFound = data.userNotFound;

	switch (true) {
		case notFound: {
			return ELoginErrors.USER_NOT_FOUND;
		}
		case invalidCreds: {
			return ELoginErrors.INVALID_CREDENTIALS;
		}
		case !isActive: {
			return ELoginErrors.USER_NOT_FOUND;
		}
		case data instanceof Error:
		case undefined:
		case null: {
			return ELoginErrors.SERVER_ERROR;
		}
		default:
			return null;
	}
};

const hasError = (data: UserExistsResponse) => {
	const isActive = data.isActiveUser;
	const invalidCreds = data.invalidCreds;
	const notFound = data.userNotFound;

	return !isActive || invalidCreds || notFound;
};

interface ErrorInfo {
	error: string | null | undefined;
	key: number;
}

const LoginPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const [isSubmitting, setIsSubmitting] = useState(false);

	const [error, setError] = useState<ErrorInfo>({
		error: null,
		key: 0,
	});
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

	const resetForm = () => {
		setValues({
			...values,
			username: "",
			password: "",
		});
	};

	const onSubmit = () => {
		setIsSubmitting(true);
		handleLogin().finally(() => {
			startTransition(() => {
				setIsSubmitting(false);
			});
		});
	};

	const handleLogin = async () => {
		const { username, password } = values;
		const userResp = (await fetchUserExists(
			username,
			password
		)) as AwaitedResponse<UserExistsResponse>;
		const data = userResp.Data as UserExistsResponse;
		const userCheckFailed = hasError(data);
		await sleep(350);
		// We use the 'error.key' to insure a re-render occurs when 2 of the same error occurs
		if (userCheckFailed) {
			const err = getFailedLoginMsg(data);
			resetForm();
			return setError({
				error: err,
				key: error.key + 1,
			});
		}

		// Attempt login, after validating user exists
		const loginData = await dispatch(loginUser(values)).unwrap();

		if (loginData) {
			setAccessTokenCookie(loginData.token as string);
			navigate("/");
		} else {
			setError(loginData);
			resetForm();
			setIsSubmitting(false);
		}
	};

	return (
		<div className={styles.LoginPage}>
			<div className={styles.LoginPage_header}>
				<h2>💪 Fitness Tracker (v2)</h2>
			</div>
			<div className={styles.LoginPage_form}>
				<div className={styles.LoginPage_form_err}>
					{error.error && <ErrorMsg key={error.key} msg={error.error} />}
				</div>
				<LoginForm
					values={values}
					onChange={onChange}
					onSubmit={onSubmit}
					isLoading={isSubmitting}
					goTo={() => navigate("/account")}
				/>
			</div>
		</div>
	);
};

export default LoginPage;
