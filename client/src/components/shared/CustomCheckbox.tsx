import styles from "../../css/shared/CustomCheckbox.module.scss";

type Props = {
	name: string;
	id: string;
	value: boolean;
	label: string;
	onChange: (name: string, value: boolean) => void;
};

const CustomCheckbox = ({ name, id, value, label, onChange }: Props) => {
	const handleChange = () => {
		const newValue = !value;

		return onChange && onChange(name, newValue);
	};
	return (
		<div
			onClick={handleChange}
			id={id}
			className={styles.CustomCheckbox}
			data-checked={value}
		>
			<div className={styles.CustomCheckbox_input}>
				{value && <div className={styles.CustomCheckbox_input_check}>✓</div>}
			</div>
			<label htmlFor={name} className={styles.CustomCheckbox_label}>
				{label}
			</label>
		</div>
	);
};

export default CustomCheckbox;
