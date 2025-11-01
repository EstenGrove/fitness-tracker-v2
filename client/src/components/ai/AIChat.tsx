import styles from "../../css/ai/AIChat.module.scss";
import ChatWindow from "../chat/ChatWindow";
import { CurrentUser } from "../../features/user/types";

type Props = {
	isNewChat: boolean;
	endpoint: string;
	currentUser: CurrentUser;
	suggestions: Array<any>;
};

const AIChat = ({
	currentUser,
	endpoint,
	suggestions = [],
	isNewChat,
}: Props) => {
	return (
		<div className={styles.AIChat}>
			<ChatWindow endpoint={endpoint} quickPrompts={suggestions} />
		</div>
	);
};

export default AIChat;
