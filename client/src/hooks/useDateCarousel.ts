import { addDays, subDays } from "date-fns";
import { useState } from "react";

const useDateCarousel = (
	baseDate: Date | string = new Date(),
	step: number = 1
) => {
	const [currentDate, setCurrentDate] = useState<Date | string>(baseDate);

	const onPrev = () => {
		const prev = subDays(currentDate, step);
		setCurrentDate(prev);
	};
	const onNext = () => {
		const next = addDays(currentDate, step);
		setCurrentDate(next);
	};

	return {
		currentDate,
		onPrev,
		onNext,
	};
};

export { useDateCarousel };
