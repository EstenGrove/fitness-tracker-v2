import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetMedDetailsQuery } from "../features/medications/medicationsApi";
import { MedDetails } from "../utils/utils_medications";

const useMedDetails = (medID: number) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading, refetch } = useGetMedDetailsQuery(
		{
			userID: currentUser?.userID,
			medID: medID,
		},
		{ skip: !shouldFetch }
	);
	const details = data as MedDetails;
	return {
		data: details,
		isLoading: isLoading,
		refetch: refetch,
	};
};

export { useMedDetails };
