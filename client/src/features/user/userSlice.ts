import { createSlice } from "@reduxjs/toolkit";
import { CurrentSession, CurrentUser } from "./types";
import { ETStatus, TStatus } from "../types";
import { RootState } from "../../store/store";
import { loginUser } from "./operations";

const fakeUser: CurrentUser = {
	userID: "e17e4fa3-bcf8-4332-819c-b5802fd070b1",
	username: "estengrove99@gmail.com",
	password: "Tripper99!",
	firstName: "Steven",
	lastName: "Gore",
	userAvatar: null,
	isActive: true,
	createdDate: new Date().toString(),
	lastLoginDate: new Date().toString(),
	token: null,
};

export interface UserSlice {
	status: TStatus;
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	error: string | null;
}

const initialState: UserSlice = {
	status: "IDLE",
	currentUser: fakeUser,
	currentSession: null,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(loginUser.pending, (state) => {
				state.status = ETStatus.PENDING;
			})
			.addCase(loginUser.fulfilled, (state, action) => {
				state.status = ETStatus.FULFILLED;
				state.currentUser = action.payload.user;
				state.currentSession = action.payload.session;
			})
			.addCase(loginUser.rejected, (state) => {
				state.status = ETStatus.REJECTED;
				state.error = new Error("Login failed").message;
			});
	},
});

export const selectCurrentUser = (state: RootState) => {
	return state.user.currentUser as CurrentUser;
};
export const selectCurrentSession = (state: RootState) => {
	return state.user.currentSession as CurrentSession;
};

export default userSlice.reducer;
