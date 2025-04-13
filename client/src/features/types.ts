import { Activity } from "./activity/types";

export type TStatus = "IDLE" | "PENDING" | "FULFILLED" | "REJECTED";

export type TResponseStatus = "SUCCESS" | "FAIL";
export type TResponse<T> = {
	Status: TStatus;
	Data: T | Record<string, string>;
	Message: string;
	ErrorMsg: string | null;
	StackTrace: string | null;
};

// Example: AsyncResponse<{ user: CurrentUser; session: CurrentSession }>
// - Designed to be used within an async function definition, NOT the consumer
export type AsyncResponse<T> = Promise<TResponse<T> | unknown>;
// Example: AwaitedResponse<{ user: CurrentUser; session: CurrentSession }>
// - Designed to be used within an async function consumer (eg when awaiting a response)
export type AwaitedResponse<T> = TResponse<T>;

export interface DateRange {
	startDate: string;
	endDate: string;
}

export interface UserRangeParams {
	userID: string;
	startDate: string;
	endDate: string;
}

export interface UserRangeActivityParams extends UserRangeParams {
	activityType: Activity;
}

export enum EMenuAction {
	EDIT = "EDIT",
	VIEW = "VIEW",
	COMPLETE = "COMPLETE",
	CANCEL = "CANCEL",
	DELETE = "DELETE",
}
