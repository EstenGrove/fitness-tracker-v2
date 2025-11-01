import { RefObject } from "react";
import styles from "../../css/ai/AIChatMessagesWindow.module.scss";
import { AIChatMessage } from "../../features/ai/types";
import AIChatBubble from "./AIChatBubble";

type Props = {
	messageEndRef: RefObject<HTMLDivElement | null>;
	messages: AIChatMessage[];
};

const isAIMessage = (message: AIChatMessage) => {
	return message.role === "ai";
};
const isUserMessage = (message: AIChatMessage) => {
	return message.role === "user";
};

const AIChatMessagesWindow = ({ messageEndRef, messages = [] }: Props) => {
	return (
		<div className={styles.AIChatMessagesWindow}>
			<div className={styles.AIChatMessagesWindow_messages}>
				{messages &&
					messages.map((message, idx) => {
						const key = `${idx}-ai`;

						if (isAIMessage(message)) {
							return <div key={key}>AI Message</div>;
						} else if (isUserMessage(message)) {
							return <AIChatBubble key={key} message={message} />;
						} else {
							return null;
						}
					})}
				<div
					ref={messageEndRef}
					className={styles.AIChat_content_mostRecent}
				></div>
			</div>
		</div>
	);
};

export default AIChatMessagesWindow;
