import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetMedsInfoQuery } from "../features/medications/medicationsApi";
import { MedsInfo } from "../utils/utils_medications";

const useMedsInfo = (targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetMedsInfoQuery(
		{
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);
	const info = data as MedsInfo;

	return {
		data: info,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useMedsInfo };
