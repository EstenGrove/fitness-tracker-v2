import styles from "../../css/ai/AIChat.module.scss";
import ChatWindow from "../chat/ChatWindow";
import { CurrentUser } from "../../features/user/types";
import { QuickPrompt } from "../../features/chat/types";

type Props = {
	isNewChat: boolean;
	endpoint: string;
	currentUser: CurrentUser;
	suggestions: QuickPrompt[];
};

const AIChat = ({
	currentUser,
	endpoint,
	suggestions = [],
	isNewChat,
}: Props) => {
	console.log("[USER]:", { currentUser, isNewChat });
	return (
		<div className={styles.AIChat}>
			<ChatWindow endpoint={endpoint} quickPrompts={suggestions} />
		</div>
	);
};

export default AIChat;
