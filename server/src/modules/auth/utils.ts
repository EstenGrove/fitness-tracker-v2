import dotenv from "dotenv";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { JWTAccessPayload, JWTRefreshPayload } from "./types.ts";
import type { Context } from "hono";
import { setCookie } from "hono/cookie";
import { isLocalEnv } from "../../utils/env.ts";
dotenv.config();

const ACCESS_TOKEN = {
	SECRET: process.env.JWT_SECRET as string,
	EXPIRES_IN: process.env.JWT_EXPIRATION as SignOptions["expiresIn"],
};

const REFRESH_TOKEN = {
	SECRET: process.env.JWT_REFRESH_SECRET as string,
	EXPIRES_IN: process.env.JWT_REFRESH_EXPIRATION as SignOptions["expiresIn"],
};

const generateAccessToken = (payload: JWTAccessPayload) => {
	return new Promise((resolve) => {
		const token = jwt.sign(payload, ACCESS_TOKEN.SECRET, {
			expiresIn: ACCESS_TOKEN.EXPIRES_IN,
		});

		resolve(token);
	});
};
const generateRefreshToken = (payload: JWTRefreshPayload) => {
	return new Promise((resolve) => {
		const token = jwt.sign(payload, REFRESH_TOKEN.SECRET, {
			expiresIn: REFRESH_TOKEN.EXPIRES_IN,
		});

		resolve(token);
	});
};

const verifyAccessToken = (token: string) => {
	return new Promise((resolve) => {
		const signed = jwt.verify(token, ACCESS_TOKEN.SECRET) as JWTAccessPayload;
		resolve(signed);
	});
};
const verifyRefreshToken = (token: string) => {
	return new Promise((resolve) => {
		const signed = jwt.verify(token, REFRESH_TOKEN.SECRET) as JWTRefreshPayload;
		resolve(signed);
	});
};

const getUserIDFromToken = async (token: string) => {
	try {
		const decoded = (await verifyAccessToken(token)) as { userID: string };
		console.log("decoded", decoded);
		return decoded.userID;
	} catch (error) {
		return null;
	}
};

const setAccessToken = (ctx: Context, accessToken: string) => {
	const isSecure = isLocalEnv ? false : true;
	setCookie(ctx, "access_token", accessToken, {
		httpOnly: true,
		path: "/",
		secure: isSecure,
		sameSite: "Strict",
	});
};

export {
	ACCESS_TOKEN,
	REFRESH_TOKEN,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
	getUserIDFromToken,
	setAccessToken,
};
