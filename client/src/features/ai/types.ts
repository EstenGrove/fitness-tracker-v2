export interface AIChatMessage {
	role: "user" | "ai";
	text: string;
	createdAt: string;
}

// Represents the 'ai_chat' table for the front-end
export interface AIChatInfo {
	userID: string;
	chatID: string;
	title: string;
	createdDate: string;
	updatedDate: string | null;
}

// Represents a single chat session
export interface AIChatHistory {
	chatID: string; // guid
	title: string;
	date: string;
	messages?: AIChatMessage[];
}
