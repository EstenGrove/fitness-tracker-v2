import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { currentEnv } from "../../utils/utils_env";
import {
	ChatMessagesData,
	ChatInfoData,
	fetchChatMessages,
	fetchChatInfo,
	fetchChatConversations,
	ConversationData,
} from "../../utils/utils_chat";
import { ChatConversations, ChatInfo, ChatMessage, ChatParams } from "./types";
import { AwaitedResponse } from "../types";

export const chatApi = createApi({
	reducerPath: "chatApi",
	baseQuery: fetchBaseQuery({ baseUrl: currentEnv.base }),
	endpoints: (builder) => ({
		getChatMessages: builder.query<ChatMessage[], ChatParams>({
			queryFn: async (params) => {
				const { userID, chatID } = params;
				const response = (await fetchChatMessages(
					userID,
					chatID
				)) as AwaitedResponse<ChatMessagesData>;
				const { messages } = response.Data as ChatMessagesData;
				return { data: messages };
			},
		}),
		getChatInfo: builder.query<ChatInfo, ChatParams>({
			queryFn: async (params) => {
				const { userID, chatID } = params;
				const response = (await fetchChatInfo(
					userID,
					chatID
				)) as AwaitedResponse<ChatInfoData>;
				const { info } = response.Data as ChatInfoData;
				return { data: info };
			},
		}),
		getConversations: builder.query<ChatConversations, ChatParams>({
			queryFn: async (params) => {
				const { userID } = params;
				const response = (await fetchChatConversations(
					userID
				)) as AwaitedResponse<ConversationData>;
				const { chats } = response.Data as ConversationData;
				return { data: chats };
			},
		}),
	}),
});

export const {
	useGetChatInfoQuery,
	useGetChatMessagesQuery,
	useGetConversationsQuery,
} = chatApi;
