import { useSelector } from "react-redux";
import { HistoryDetailsParams } from "../utils/utils_history";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetHistoryDetailsQuery } from "../features/history/historyApi";
import { HistoryDetails } from "../features/history/types";

const useHistoryDetails = (params: HistoryDetailsParams) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetHistoryDetailsQuery(params, {
		skip: !shouldFetch,
	});
	const historyDetails = data as HistoryDetails;

	return {
		refetch: refetch,
		data: historyDetails,
		isLoading: isLoading,
	};
};

export { useHistoryDetails };
