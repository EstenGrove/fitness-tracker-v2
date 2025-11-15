import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetNavItemsQuery } from "../features/settings/api";
import { SettingsNavsInfo } from "../features/settings/types";

const useSettingsNavItems = () => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetNavItemsQuery(
		{
			userID: currentUser?.userID,
		},
		{ skip: !shouldFetch }
	);
	const settingsInfo = data as SettingsNavsInfo;

	return {
		data: settingsInfo,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useSettingsNavItems };
