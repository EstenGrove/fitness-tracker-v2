import { UIMessage } from "ai";
import {
	ChatConversations,
	ChatInfo,
	ChatMessage,
} from "../features/chat/types";
import { AsyncResponse } from "../features/types";
import { chatApis, currentEnv } from "./utils_env";
import { fetchWithAuth } from "./utils_requests";

export interface ChatMessagesData {
	messages: ChatMessage[];
}
export interface ChatInfoData {
	info: ChatInfo;
}
export interface ConversationData {
	chats: ChatConversations;
}
export type ChatMessagesResp = AsyncResponse<ChatMessagesData>;
export type ChatInfoResp = AsyncResponse<ChatInfoData>;
export type ConversationsResp = AsyncResponse<ConversationData>;

const fetchChatMessages = async (
	userID: string,
	chatID: string
): ChatMessagesResp => {
	let url = currentEnv.base + chatApis.messages;
	url += "?" + new URLSearchParams({ userID, chatID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};

const fetchChatInfo = async (userID: string, chatID: string): ChatInfoResp => {
	let url = currentEnv.base + chatApis.messages;
	url += "?" + new URLSearchParams({ userID, chatID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};

const fetchChatConversations = async (userID: string): ConversationsResp => {
	let url = currentEnv.base + chatApis.conversations;
	url += "?" + new URLSearchParams({ userID });

	try {
		const request = await fetchWithAuth(url);
		const response = await request.json();
		return response.Data;
	} catch (error) {
		return error;
	}
};

const isSystemMessage = (message: ChatMessage | UIMessage) => {
	return message.role === "system";
};
const isAIMessage = (message: ChatMessage | UIMessage) => {
	return message.role === "assistant";
};
const isUserMessage = (message: ChatMessage | UIMessage) => {
	return message.role === "user";
};

const getTextFromMessageParts = (message: UIMessage): string => {
	if (!message.parts) return "";
	return message.parts
		.map((part) => {
			if (part.type === "text") return part.text;
			return "";
		})
		.join("");
};

export {
	// Chat Request handlers
	fetchChatMessages,
	fetchChatInfo,
	fetchChatConversations,
	// Chat Message & UI utils
	isSystemMessage,
	isAIMessage,
	isUserMessage,
	getTextFromMessageParts,
};
