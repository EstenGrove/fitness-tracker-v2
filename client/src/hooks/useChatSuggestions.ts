import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetChatSuggestionsQuery } from "../features/chat/api";
import { QuickPrompt } from "../features/chat/types";

const useChatSuggestions = () => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetChatSuggestionsQuery(
		{ userID: currentUser?.userID },
		{ skip: !shouldFetch }
	);
	const suggestions = data as QuickPrompt[];

	return {
		data: suggestions,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useChatSuggestions };
