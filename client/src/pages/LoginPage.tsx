import { useRef, useState } from "react";
import LoginForm from "../components/login/LoginForm";
import styles from "../css/pages/LoginPage.module.scss";
import sprite from "../assets/icons/calendar.svg";
import { LoginValues } from "../features/user/types";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../store/store";
import { loginUser } from "../features/user/operations";
import { useSelector } from "react-redux";
import { isSubmitting as isSubmittingLogin } from "../features/user/userSlice";
import { fetchUserExists, UserExistsResponse } from "../utils/utils_user";
import { AwaitedResponse } from "../features/types";
import FadeIn from "../components/ui/FadeIn";
import SelfDestruct from "../components/ui/SelfDestruct";

const ErrorMsg = ({ msg }: { msg: string }) => {
	return (
		<SelfDestruct expiry={4000}>
			<FadeIn>
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

const LoginPage = () => {
	const navigate = useNavigate();
	const dispatch = useAppDispatch();
	const errRef = useRef<number | null>(null);
	const isSubmitting = useSelector(isSubmittingLogin);
	const [error, setError] = useState<string | null | undefined>(null);
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

	const onSubmit = async () => {
		const { username, password } = values;
		const userResp = (await fetchUserExists(
			username,
			password
		)) as AwaitedResponse<UserExistsResponse>;
		const userExists = userResp.Data.isActiveUser;

		if (!userExists) {
			resetForm();
			errRef.current = setTimeout(() => {
				setError(null);
			}, 4000);
			return setError("Invalid credentials");
		}

		const loginData = await dispatch(loginUser(values)).unwrap();

		if (loginData) {
			navigate("/");
		} else {
			setError(loginData);
			resetForm();
		}
	};

	return (
		<div className={styles.LoginPage}>
			<div className={styles.LoginPage_header}>
				<h2>💪 Fitness Tracker (v2)</h2>
			</div>
			<div className={styles.LoginPage_form}>
				<div className={styles.LoginPage_form_err}>
					{error && <ErrorMsg msg={error} />}
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
