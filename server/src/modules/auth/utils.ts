import dotenv from "dotenv";
import jwt, { type SignOptions } from "jsonwebtoken";
import type { JWTAccessPayload, JWTRefreshPayload } from "./types.ts";
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

export {
	ACCESS_TOKEN,
	REFRESH_TOKEN,
	generateAccessToken,
	generateRefreshToken,
	verifyAccessToken,
	verifyRefreshToken,
};
