import {
	ChangeEvent,
	ComponentPropsWithoutRef,
	RefObject,
	useState,
} from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/shared/PasswordInput.module.scss";

interface InputProps {
	id?: string;
	name: string;
	value: string;
	onChange: (name: string, value: string) => void;
	inputRef?: RefObject<HTMLInputElement | null>;
	placeholder?: string;
	isDisabled?: boolean;
	isInvalid?: boolean;
}

// @ts-expect-error: this is fine
interface Props extends InputProps, ComponentPropsWithoutRef<"input"> {}

const show = "remove_red_eye";
const hide = "visibility_off";

const PasswordInput = ({
	id,
	name,
	value,
	onChange,
	placeholder = "",
	isDisabled = false,
	isInvalid = false,
	...rest
}: Props) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;

		return onChange && onChange(name, value);
	};

	const toggleShow = () => {
		setShowPassword(!showPassword);
	};

	return (
		<div className={styles.PasswordInput} {...rest}>
			<input
				type={showPassword ? "text" : "password"}
				name={name}
				id={id}
				value={value}
				onChange={handleChange}
				placeholder={placeholder}
				className={styles.PasswordInput_input}
				disabled={isDisabled}
				aria-invalid={isInvalid}
				{...rest}
			/>
			<div className={styles.PasswordInput_wrapper} onClick={toggleShow}>
				<svg className={styles.PasswordInput_wrapper_icon}>
					<use xlinkHref={`${sprite}#icon-${showPassword ? show : hide}`}></use>
				</svg>
			</div>
		</div>
	);
};

export default PasswordInput;
