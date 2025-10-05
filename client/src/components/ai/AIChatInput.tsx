import { useState, useEffect, useRef, ChangeEvent, KeyboardEvent } from "react";
import sprite from "../../assets/icons/calendar.svg";
import styles from "../../css/ai/AIChatInput.module.scss";

type Props = {
	id?: string;
	name?: string;
	onChange?: (name: string, value: string) => void;
	onSend: (value: string) => void; // optional send callback
};

const SendButton = ({
	onClick,
	isExpanded = false,
}: {
	isExpanded: boolean;
	onClick?: () => void;
}) => {
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

const AIChatInput = ({
	id = "chat",
	name = "chat",
	onChange,
	onSend,
}: Props) => {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const [isExpanded, setIsExpanded] = useState<boolean>(false);
	const [text, setText] = useState<string>("");

	const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { name, value } = e.target;
		setText(value);
		return onChange && onChange(name, value);
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
			}
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

			{!!text && (
				<SendButton onClick={() => onSend(text)} isExpanded={isExpanded} />
			)}
		</div>
	);
};

export default AIChatInput;
