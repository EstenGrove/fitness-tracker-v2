import {
	useRef,
	useState,
	useEffect,
	type ChangeEvent,
	type KeyboardEvent,
} from "react";
import sprite from "../../assets/icons/chat.svg";
import styles from "../../css/chat/ChatInput.module.scss";

type Props = {
	onSend: (value: string) => void;
	onCancel: () => void;
	isSending: boolean;
};

const SendButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.SendButton}>
			<svg className={styles.SendButton_icon}>
				<use xlinkHref={`${sprite}#icon-arrow_forward`}></use>
			</svg>
		</button>
	);
};
const StopButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.StopButton}>
			<svg className={styles.StopButton_icon}>
				<use xlinkHref={`${sprite}#icon-controller-stop`}></use>
			</svg>
		</button>
	);
};

const AddButton = () => {
	return (
		<button className={styles.AddButton}>
			<svg className={styles.AddButton_icon}>
				<use xlinkHref={`${sprite}#icon-add`}></use>
			</svg>
		</button>
	);
};

const ChatInput = ({ onSend, onCancel, isSending }: Props) => {
	const inputRef = useRef<HTMLTextAreaElement | null>(null);
	const [value, setValue] = useState<string>("");
	const [isExpanded, setIsExpanded] = useState<boolean>(false);

	const onChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
		const { value } = e.target;
		setValue(value);
	};

	const onKeydown = (e: KeyboardEvent) => {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			handleSend();
		}
	};

	const handleSend = () => {
		onSend(value);
		setValue("");
	};
	const handleCancel = () => {
		onCancel();
	};

	// Smooth auto-expanding textarea
	useEffect(() => {
		const el = inputRef.current;
		if (!el) return;

		// match CSS max-height: 30rem or 300px
		const baseHeight = 30;
		const maxHeight = 300;

		el.style.height = "auto";
		const newHeight = el.scrollHeight;

		// If content exceeds max height, lock height and enable scrolling
		if (newHeight > maxHeight) {
			setIsExpanded(true);
			el.style.height = `${maxHeight}px`;
			el.style.overflowY = "auto";
		} else {
			// When the input 1st expands, change the border-radius
			setIsExpanded(newHeight > baseHeight);
			el.style.height = `${newHeight}px`;
			el.style.overflowY = "hidden";
		}
	}, [value]);

	return (
		<div className={styles.ChatInput}>
			<AddButton />
			<div className={styles.ChatInput_wrapper}>
				<textarea
					name="input"
					id="input"
					ref={inputRef}
					value={value}
					onKeyDown={onKeydown}
					onChange={onChange}
					className={styles.ChatInput_wrapper_input}
					placeholder="Ask anything"
					rows={1}
				></textarea>
				{!!value && <SendButton onClick={handleSend} />}
				{isSending && <StopButton onClick={handleCancel} />}
			</div>
		</div>
	);
};

export default ChatInput;
