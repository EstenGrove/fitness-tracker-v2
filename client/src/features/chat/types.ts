import { UIMessage } from "ai";

export interface ChatMessage extends UIMessage {
	metadata: {
		createdAt: string;
	};
}

export interface ChatInfo {
	chatID: string;
	userID: string;
	title: string;
	messages: ChatMessage[];
	createdAt: string;
	updatedAt: string | null;
}

export type ChatConversations = ChatInfo[];

export interface ChatParams {
	userID: string;
	chatID: string;
}

export interface QuickPrompt {
	promptID: number;
	prompt: string;
	label: string;
	categories?: string[];
}
