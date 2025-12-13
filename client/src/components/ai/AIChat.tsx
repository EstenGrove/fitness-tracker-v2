import styles from "../../css/ai/AIChat.module.scss";
import ChatWindow from "../chat/ChatWindow";
import { CurrentUser } from "../../features/user/types";
import { ChatSuggestion } from "../../features/chat/types";

type Props = {
	isNewChat: boolean;
	endpoint: string;
	currentUser: CurrentUser;
	suggestions: ChatSuggestion[];
};

const AIChat = ({
	endpoint,
	suggestions = [],
}: // currentUser,
// isNewChat,
Props) => {
	return (
		<div className={styles.AIChat}>
			<ChatWindow endpoint={endpoint} quickPrompts={suggestions} />
		</div>
	);
};

export default AIChat;
