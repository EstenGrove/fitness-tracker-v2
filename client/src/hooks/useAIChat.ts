import { DefaultChatTransport } from "ai";
import { ChatMessage } from "../features/chat/types";
import { currentEnv } from "../utils/utils_env";
import { useChat } from "@ai-sdk/react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";

interface HookOpts {
	endpoint: string;
	initialMessages?: ChatMessage[];
}

const useAIChat = ({ endpoint, initialMessages = [] }: HookOpts) => {
	const currentUser = useSelector(selectCurrentUser);
	const { messages, sendMessage, stop, status } = useChat({
		messages: initialMessages,
		transport: new DefaultChatTransport({
			api: currentEnv.base + endpoint,
			body: { userID: currentUser.userID },
		}),
	});

	return {
		messages,
		sendMessage,
		stop,
		status,
	};
};

export { useAIChat };
