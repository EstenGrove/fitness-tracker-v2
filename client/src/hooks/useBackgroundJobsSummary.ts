import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetJobsSettingsQuery } from "../features/settings/api";
import { JobsRefreshSummary } from "../features/settings/types";

const useBackgroundJobsSummary = () => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetJobsSettingsQuery(
		{
			userID: currentUser?.userID,
		},
		{ skip: !shouldFetch }
	);
	const summary = data as JobsRefreshSummary;

	return {
		data: summary,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useBackgroundJobsSummary };
