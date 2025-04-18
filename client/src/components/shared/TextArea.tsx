import { ChangeEvent, RefObject, ComponentPropsWithoutRef } from "react";
import styles from "../../css/shared/TextArea.module.scss";

interface TextAreaProps {
	name: string;
	value: string;
	id?: string;
	onChange: (name: string, value: string) => void;
	placeholder?: string;
	inputRef?: RefObject<HTMLTextAreaElement>;
}

// @ts-expect-error: THIS IS FINE
interface Props extends TextAreaProps, ComponentPropsWithoutRef<"textarea"> {}

const TextArea = ({
	name,
	id,
	value,
	onChange,
	placeholder,
	inputRef,
	...rest
}: Props) => {
	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;

		return onChange && onChange(name, value);
	};

	return (
		<div className={styles.TextArea}>
			<textarea
				ref={inputRef}
				name={name}
				id={id}
				value={value}
				className={styles.TextArea_input}
				onChange={handleChange}
				placeholder={placeholder}
				{...rest}
			></textarea>
		</div>
	);
};

export default TextArea;
