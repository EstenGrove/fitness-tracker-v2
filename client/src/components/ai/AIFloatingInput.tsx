import { useRef, useState } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/ai/AIFloatingInput.module.scss";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import AIChatInput from "./AIChatInput";

type Props = {
	onChange: (name: string, value: string) => void;
	onSend: (message: string) => void;
	onCancel: () => void;
	options?: AISourceOption[];
};

type AISourceOption = {
	icon: string;
	name: string;
	onSelect?: (...args: any[]) => void;
};

type AddSourceProps = {
	onClose: () => void;
	options?: AISourceOption[];
};

const defaultOptions: AISourceOption[] = [
	{ icon: "addchart", name: "Upload Image" },
	{ icon: "addchart", name: "Upload CSV" },
	{ icon: "addchart", name: "Upload JSON" },
];

const AddSourceModal = ({
	onClose,
	options = defaultOptions,
}: AddSourceProps) => {
	const modalRef = useRef<HTMLDivElement>(null);
	useOutsideClick(modalRef, onClose);

	return (
		<div ref={modalRef} className={styles.AddSourceModal}>
			<ul className={styles.AddSourceModal_options}>
				{options &&
					options.map((option, idx) => {
						const { name, icon, onSelect = onClose } = option;
						const key = `${idx}-${name}`;
						return (
							<li
								key={key}
								onClick={onSelect}
								className={styles.AddSourceModal_options_item}
							>
								<svg className={styles.AddSourceModal_options_item_icon}>
									<use xlinkHref={`${sprite}#icon-${icon}`}></use>
								</svg>
								<span>{name}</span>
							</li>
						);
					})}
			</ul>
		</div>
	);
};

const AddInputButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.AddInputButton}>
			<svg className={styles.AddInputButton_icon}>
				<use xlinkHref={`${sprite}#icon-add`}></use>
			</svg>
		</button>
	);
};

const AIFloatingInput = ({ onChange, onSend, onCancel }: Props) => {
	const [showOptions, setShowOptions] = useState<boolean>(false);

	const openOptions = () => {
		setShowOptions(true);
	};
	const closeOptions = () => {
		setShowOptions(false);
	};

	return (
		<div className={styles.AIFloatingInput}>
			<AddInputButton onClick={openOptions} />
			<AIChatInput onSend={onSend} onCancel={onCancel} onChange={onChange} />

			{showOptions && <AddSourceModal onClose={closeOptions} />}
		</div>
	);
};

export default AIFloatingInput;
