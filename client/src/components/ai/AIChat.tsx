import styles from "../../css/ai/AIChat.module.scss";
import { ChatSuggestion } from "../../features/chat/types";
import ChatWindow from "../chat/ChatWindow";

type Props = {
	isNewChat: boolean;
	endpoint: string;
	suggestions: ChatSuggestion[];
};

const AIChat = ({ endpoint, suggestions = [] }: Props) => {
	return (
		<div className={styles.AIChat}>
			<ChatWindow endpoint={endpoint} quickPrompts={suggestions} />
		</div>
	);
};

export default AIChat;
