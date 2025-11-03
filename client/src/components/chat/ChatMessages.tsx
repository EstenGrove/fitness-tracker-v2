import type { RefObject } from "react";
import styles from "../../css/chat/ChatMessages.module.scss";
import ReactMarkdown from "react-markdown";
import {
	getTextFromMessageParts,
	isAIMessage,
	isSystemMessage,
	isUserMessage,
} from "../../utils/utils_chat";
import type { UIMessage } from "ai";
import { ChatMessage } from "../../features/chat/types";

type Props = {
	onScroll: () => void;
	onClear: (id: string | number) => void;
	containerRef: RefObject<HTMLDivElement | null>;
	messageEndRef: RefObject<HTMLDivElement | null>;
	messages: ChatMessage[];
};

type UserMessageProps = {
	content: string;
	createdAt: string;
};

const SHOW_CONTROLS = false;

const UserMessage = ({ content, createdAt }: UserMessageProps) => {
	const timestamp = createdAt || "2025-10-10 14:25:823 PM";
	return (
		<div className={styles.UserMessage}>
			{SHOW_CONTROLS && (
				<div className={styles.UserMessage_controls}>
					<div className={styles.UserMessage_controls_timestamp}>
						{timestamp}
					</div>
				</div>
			)}
			<div className={styles.UserMessage_bubble}>
				<div className={styles.UserMessage_bubble_content}>{content}</div>
			</div>
		</div>
	);
};

type SystemMessageProps = {
	message: ChatMessage;
	onClear: () => void;
};

const SystemMessage = ({ message, onClear }: SystemMessageProps) => {
	const content = getTextFromMessageParts(message);

	return (
		<div className={styles.SystemMessage}>
			<div className={styles.SystemMessage_controls}>
				<button
					type="button"
					onClick={onClear}
					className={styles.SystemMessage_controls_clear}
				>
					Clear
				</button>
			</div>
			<div className={styles.SystemMessage_container}>
				<div className={styles.SystemMessage_container_content}>{content}</div>
			</div>
		</div>
	);
};

type AIMessageProps = {
	message: UIMessage;
};

const AIMessage = ({ message }: AIMessageProps) => {
	const content = getTextFromMessageParts(message);
	return (
		<div className={styles.AIMessage}>
			<div className={styles.AIMessage_content}>
				<ReactMarkdown>{content}</ReactMarkdown>
			</div>
		</div>
	);
};

type MessageProps = {
	message: ChatMessage;
	onClear: () => void;
};

const Message = ({ message, onClear }: MessageProps) => {
	const content = getTextFromMessageParts(message);
	const createdAt = message.metadata?.createdAt;

	return (
		<>
			{isAIMessage(message) && <AIMessage message={message} />}

			{isUserMessage(message) && (
				<UserMessage content={content} createdAt={createdAt} />
			)}

			{isSystemMessage(message) && (
				<SystemMessage message={message} onClear={onClear} />
			)}
		</>
	);
};

const ChatMessages = ({
	messageEndRef,
	containerRef,
	onScroll,
	onClear,
	messages = [],
}: Props) => {
	const hasMessages = messages && messages.length > 0;
	return (
		<div className={styles.ChatMessages}>
			<div
				ref={containerRef}
				onScroll={onScroll}
				className={styles.ChatMessages_messages}
			>
				{hasMessages &&
					messages.map((message, idx) => {
						return (
							<Message
								key={idx}
								message={message}
								onClear={() => onClear(message.id)}
							/>
						);
					})}
				<div
					ref={messageEndRef}
					className={styles.AIChat_content_mostRecent}
				></div>
			</div>
		</div>
	);
};

export default ChatMessages;
