import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CurrentSession, CurrentUser } from "./types";
import { ETStatus, TStatus } from "../types";
import { RootState } from "../../store/store";
import {
	getUserByLogin,
	loginUser,
	logoutUser,
	refreshAuth,
} from "./operations";
import { LoginResponse, UserResponse } from "../../utils/utils_user";

export interface UserSlice {
	status: TStatus;
	currentUser: CurrentUser | null;
	currentSession: CurrentSession | null;
	error: string | null;
}

const initialState: UserSlice = {
	status: "IDLE",
	currentUser: null,
	currentSession: null,
	error: null,
};

const userSlice = createSlice({
	name: "user",
	initialState: initialState,
	reducers: {},
	extraReducers(builder) {
		// LOGIN
		builder
			.addCase(loginUser.pending, (state: UserSlice) => {
				state.status = ETStatus.PENDING;
			})
			.addCase(
				loginUser.fulfilled,
				(state: UserSlice, action: PayloadAction<LoginResponse>) => {
					state.status = ETStatus.FULFILLED;
					state.currentUser = action.payload.user;
					state.currentSession = action.payload.session;
					state.error = action.payload.error;
				}
			)
			.addCase(loginUser.rejected, (state: UserSlice) => {
				state.status = ETStatus.REJECTED;
				state.error = new Error("Login failed").message;
			});

		// LOGOUT
		builder
			.addCase(logoutUser.pending, (state: UserSlice) => {
				state.status = ETStatus.PENDING;
			})
			.addCase(logoutUser.fulfilled, (state: UserSlice) => {
				state.status = ETStatus.FULFILLED;
				state.currentUser = null;
				state.currentSession = null;
			})
			.addCase(logoutUser.rejected, (state: UserSlice, action) => {
				const msg = action.error;
				state.status = ETStatus.REJECTED;
				state.error = msg
					? (msg.message as string)
					: new Error("Logout failed").message;
				state.currentUser = null;
				state.currentSession = null;
			});

		// REFRESH AUTH
		builder
			.addCase(refreshAuth.pending, (state) => {
				state.status = ETStatus.PENDING;
			})
			.addCase(refreshAuth.fulfilled, (state, action) => {
				state.status = ETStatus.FULFILLED;
				state.currentUser = action.payload.currentUser;
				state.currentSession = action.payload.currentSession;
			})
			.addCase(refreshAuth.rejected, (state) => {
				state.status = ETStatus.REJECTED;
				state.currentUser = null;
				state.currentSession = null;
			});

		// GET USER BY LOGIN INFO
		builder
			.addCase(getUserByLogin.pending, (state: UserSlice) => {
				state.status = ETStatus.PENDING;
			})
			.addCase(
				getUserByLogin.fulfilled,
				(state: UserSlice, action: PayloadAction<UserResponse>) => {
					state.status = ETStatus.FULFILLED;
					state.currentUser = action.payload.user;
					state.error = action.payload.error;
				}
			);

		// CHECK IF USER EXISTS
	},
});

export const isSubmitting = (state: RootState) => {
	return state.user.status === ETStatus.PENDING;
};

export const selectCurrentUser = (state: RootState) => {
	return state.user.currentUser as CurrentUser;
};
export const selectCurrentSession = (state: RootState) => {
	return state.user.currentSession as CurrentSession;
};

export default userSlice.reducer;
