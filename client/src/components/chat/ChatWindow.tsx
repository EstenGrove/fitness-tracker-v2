import { useEffect, useMemo, useRef, useState, type RefObject } from "react";
import sprite from "../../assets/icons/chat.svg";
import styles from "../../css/chat/ChatWindow.module.scss";
import type { ChatMessage, QuickPrompt } from "../../features/chat/types";
import { DefaultChatTransport } from "ai";
import { currentEnv } from "../../utils/utils_env";
import { useChat } from "@ai-sdk/react";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import ChatQuickPrompts from "./ChatQuickPrompts";

type Props = {
	endpoint: string;
	quickPrompts?: QuickPrompt[];
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

const fake: ChatMessage[] = [
	{
		parts: [
			{
				type: "text",
				text: "Whats the capitol of tennesse",
			},
		],
		id: "Kl0D6yFjo7sbjdZW",
		role: "user",
		metadata: {
			createdAt: "10/26/2025 10:23:39.661 AM",
		},
	},
	{
		id: "m7CtEJ8YOYIYiYLK",
		metadata: {
			createdAt: "10/26/2025 10:23:39.697 AM",
		},
		role: "assistant",
		parts: [
			{
				type: "step-start",
			},
			{
				type: "text",
				text: "The capital of Tennessee is **Nashville**.",
				state: "done",
			},
		],
	},
];

const ChatWindow = ({ endpoint, quickPrompts = [] }: Props) => {
	const recentMsgRef = useRef<HTMLDivElement>(null);
	const containerRef = useRef<HTMLDivElement>(null);
	const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
	const { messages, sendMessage, stop, status } = useChat({
		messages: [...fake],
		transport: new DefaultChatTransport({
			api: currentEnv.base + endpoint,
		}),
	});
	const hasSuggestions = quickPrompts && quickPrompts?.length > 0;

	const hasMessages = useMemo(() => {
		return messages && messages?.length > 0;
	}, [messages]);

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

	const selectSuggestion = (option: QuickPrompt) => {
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
	}, []);

	return (
		<div className={styles.ChatWindow}>
			<div className={styles.ChatWindow_messages}>
				<ChatMessages
					messages={messages}
					messageEndRef={recentMsgRef}
					containerRef={containerRef}
					onScroll={onScroll}
					onClear={handleClear}
				/>
				{!isAtBottom && hasMessages && (
					<ScrollToBottom onClick={scrollToBottom} />
				)}
			</div>
			<div className={styles.ChatWindow_input}>
				{hasSuggestions && (
					<ChatQuickPrompts
						quickPrompts={quickPrompts}
						onSelect={selectSuggestion}
					/>
				)}
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
