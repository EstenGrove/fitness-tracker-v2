import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import sprite from "../../assets/icons/chat.svg";
import styles from "../../css/chat/ChatWindow.module.scss";
import type { ChatMessage, ChatSuggestion } from "../../features/chat/types";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatQuickPrompts from "./ChatQuickPrompts";
import { useAIChat } from "../../hooks/useAIChat";

type Props = {
	endpoint: string;
	initialMessages?: ChatMessage[];
	quickPrompts?: ChatSuggestion[];
};

const scrollToView = (
	el: RefObject<HTMLElement>,
	behavior: "smooth" | "auto" | "instant" = "smooth"
) => {
	if (!el.current) return;
	el.current.scrollIntoView({ behavior: behavior });
};

const ScrollToBottom = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.ScrollToBottom}>
			<svg className={styles.ScrollToBottom_icon}>
				<use xlinkHref={`${sprite}#icon-arrow_downward`}></use>
			</svg>
		</button>
	);
};

const SHOW_SUGGESTIONS = true;

const ChatWindow = ({
	endpoint,
	initialMessages = [],
	quickPrompts = [],
}: Props) => {
	const recentMsgRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
	const { messages, sendMessage, stop, status } = useAIChat({
		initialMessages: initialMessages,
		endpoint: endpoint,
	});
	const hasSuggestions = quickPrompts && quickPrompts?.length > 0;

	const hasMessages = useMemo(() => {
		return messages && messages?.length > 0;
	}, [messages]);
	const showSuggestions = hasSuggestions && !hasMessages && SHOW_SUGGESTIONS;

	const handleSend = (value: string) => {
		sendMessage({
			text: value,
		});
	};

	const handleCancel = () => {
		stop();
	};

	const handleClear = (msgID?: string | number) => {
		console.log("msgID", msgID);
	};

	const selectSuggestion = (option: ChatSuggestion) => {
		const { prompt } = option;
		handleSend(prompt);
	};

	const onScroll = () => {
		if (!containerRef.current) return;
		const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

		const atBottom = scrollTop + clientHeight >= scrollHeight - 10;
		setIsAtBottom(atBottom);
	};

	const scrollToBottom = () => {
		if (!recentMsgRef.current) return;
		scrollToView(recentMsgRef as RefObject<HTMLElement>);
		setIsAtBottom(true);
	};

	// Smooth scroll to most recent message
	// ##TODO:
	// - This scrolls to the bottom on page load & other times which isn't desired
	useEffect(() => {
		if (recentMsgRef.current) {
			scrollToView(recentMsgRef as RefObject<HTMLElement>);
		}
	}, [messages]);

	return (
		<div className={styles.ChatWindow}>
			<div className={styles.ChatWindow_messages}>
				<ChatMessages
					messages={messages as ChatMessage[]}
					messageEndRef={recentMsgRef}
					containerRef={containerRef}
					onScroll={onScroll}
					onClear={handleClear}
				/>
				{!isAtBottom && hasMessages && (
					<ScrollToBottom onClick={scrollToBottom} />
				)}
			</div>
			{showSuggestions && (
				<div className={styles.ChatWindow_suggestions}>
					<ChatQuickPrompts
						quickPrompts={quickPrompts}
						onSelect={selectSuggestion}
					/>
				</div>
			)}
			<div className={styles.ChatWindow_input}>
				<ChatInput
					onSend={handleSend}
					onCancel={handleCancel}
					isSending={status === "submitted" || status === "streaming"}
				/>
			</div>
		</div>
	);
};

export default ChatWindow;
