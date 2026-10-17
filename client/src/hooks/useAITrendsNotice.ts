import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
import { useGetLatestTrendNoticeQuery } from "../features/ai-trends/api";
import {
	markNoticeShownToday,
	wasNoticeShownToday,
} from "../utils/utils_aiTrends";

/**
 * Fetches the user's latest AI trend notice & manages its modal.
 * - Auto-opens on the first visit of the day (per notice)
 * - 'openNotice' re-opens it at will (eg. from the header button)
 * @returns notice - null when there's no notable trend to show
 */

const useAITrendsNotice = () => {
	const currentUser = useSelector(selectCurrentUser);
	const userID = currentUser?.userID;
	const { data: notice = null, isLoading } = useGetLatestTrendNoticeQuery(
		userID,
		{ skip: !userID },
	);
	const [isOpen, setIsOpen] = useState<boolean>(false);

	const openNotice = () => setIsOpen(true);
	const closeNotice = () => setIsOpen(false);

	useEffect(() => {
		if (!notice || wasNoticeShownToday(notice.noticeID)) return;

		markNoticeShownToday(notice.noticeID);
		setIsOpen(true);
	}, [notice]);

	return {
		notice,
		isLoading,
		isOpen,
		openNotice,
		closeNotice,
	};
};

export { useAITrendsNotice };
