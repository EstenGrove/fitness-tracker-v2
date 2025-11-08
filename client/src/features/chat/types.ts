import { UIMessage } from "ai";
import { JSX, ReactNode } from "react";

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

export interface ChatSuggestion {
	promptID: number;
	prompt: string;
	content: ReactNode | JSX.Element | string;
	categories?: string[];
	onBeforeSend?: (suggestion: ChatSuggestion) => Promise<string | null>;
}
