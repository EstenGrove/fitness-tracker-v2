import dotenv from "dotenv";
import { OAuth2Client, type TokenPayload } from "google-auth-library";
dotenv.config();

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

const googleClient = new OAuth2Client(CLIENT_ID);

export interface GooglePayload {
	googleID: string;
	username: string;
	displayName: string;
	avatar: string; // Google URL for the user's avatar/profile picture
}

const verifyGoogleToken = async (
	token: string
): Promise<GooglePayload | unknown> => {
	const ticket = await googleClient.verifyIdToken({
		idToken: token,
		audience: CLIENT_ID,
	});

	const payload = ticket.getPayload() as TokenPayload;

	console.log("[GOOGLE-PAYLOAD]: ", payload);

	if (!payload) {
		return new Error("No payload from google ticket!");
	}

	const googlePayload: GooglePayload = {
		googleID: payload.sub,
		username: payload?.email as string,
		displayName: payload?.name as string,
		avatar: payload?.picture as string,
	};

	return googlePayload;
};

export { verifyGoogleToken };
