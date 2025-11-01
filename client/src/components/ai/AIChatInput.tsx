import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/ai/AIChatInput.module.scss";

type Props = {
	id?: string;
	name?: string;
	onChange?: (name: string, value: string) => void;
	onSend: (value: string) => void; // optional send callback
	onCancel: () => void;
};

type SendProps = {
	isExpanded: boolean;
	onClick?: () => void;
};

const SendButton = ({ onClick, isExpanded = false }: SendProps) => {
	const rotateStyles = {
		transform: "rotate(-90deg)",
		transition: "all .3s ease-in-out",
	};

	return (
		<button
			className={styles.SendButton}
			onClick={onClick}
			type="button"
			style={isExpanded ? rotateStyles : {}}
		>
			<svg className={styles.SendButton_icon}>
				<use xlinkHref={`${sprite}#icon-arrow_forward`} />
			</svg>
		</button>
	);
};

type StopProps = {
	onClick: () => void;
};

const StopButton = ({ onClick }: StopProps) => {
	return (
		<button className={styles.StopButton} onClick={onClick} type="button">
			<svg className={styles.StopButton_icon}>
				<use xlinkHref={`${sprite}#icon-controller-stop`} />
				{/* <use xlinkHref={`${sprite}#icon-stop`} /> */}
			</svg>
		</button>
	);
};

const AIChatInput = ({
	id = "chat",
	name = "chat",
	onChange,
	onSend,
	onCancel,
}: Props) => {
	const [text, setText] = useState<string>("");
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [isSending, setIsSending] = useState<boolean>(false);

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setText(value);

		return onChange && onChange(name, value);
	};

	const submitSend = () => {
		if (onSend) onSend(text);
		setIsSending(true);
		setText("");
	};

	const cancelSend = () => {
		setIsSending(false);
		setText("");
		return onCancel && onCancel();
	};

	// Optional: handle Enter to send, Shift+Enter for newline
	const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
		const localText = text.trim();

		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			if (localText) {
				setText("");
				if (onSend) onSend(localText);
				if (onChange) onChange(name, ""); // reset value
				setIsSending(true);
			}
		} else {
			setIsExpanded(false);
		}
	};

	// Smooth auto-expanding textarea
	useEffect(() => {
		const el = inputRef.current;
		if (!el) return;

		// match CSS max-height
		const maxHeight = 300;

		el.style.height = "auto";
		const newHeight = el.scrollHeight;

		// If content exceeds max height, lock height and enable scrolling
		if (newHeight > maxHeight) {
			setIsExpanded(true);
			el.style.height = `${maxHeight}px`;
			el.style.overflowY = "auto";
		} else {
			setIsExpanded(false);
			el.style.height = `${newHeight}px`;
			el.style.overflowY = "hidden";
		}
	}, [text]);

	return (
		<div className={styles.AIChatInput}>
			<div className={styles.AIChatInput_inputWrapper}>
				<textarea
					ref={inputRef}
					id={id}
					name={name}
					value={text}
					placeholder="Ask anything..."
					onChange={handleChange}
					onKeyDown={handleKeyDown}
					rows={1}
					className={styles.AIChatInput_inputWrapper_input}
					style={{
						resize: "none",
						padding: "5px 10px",
						fontSize: "16px",
						outline: "none",
						transition: "height 0.2s ease",
					}}
				/>
			</div>

			{!!text && !isSending && (
				<SendButton onClick={submitSend} isExpanded={isExpanded} />
			)}
			{isSending && <StopButton onClick={cancelSend} />}
		</div>
	);
};

export default AIChatInput;
