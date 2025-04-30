import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { MedSummaryForDate } from "../features/medications/types";
import { useGetMedSummaryByDateQuery } from "../features/medications/medicationsApi";

const useMedSummary = (medID: number, targetDate: string) => {
	const currentUser = useSelector(selectCurrentUser);
	const shouldFetch = Boolean(currentUser?.userID);
	const { data, isLoading } = useGetMedSummaryByDateQuery(
		{
			medID: medID,
			userID: currentUser?.userID,
			targetDate: targetDate,
		},
		{ skip: !shouldFetch }
	);

	return {
		data: data as MedSummaryForDate,
		isLoading: isLoading,
	};
};

export { useMedSummary };
