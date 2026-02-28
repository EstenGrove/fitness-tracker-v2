export type AuthProvider = "google" | "apple";

export interface JWTAccessPayload {
	userID: string;
	exp: number;
	sessionID?: string;
}
