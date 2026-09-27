import { useState } from "react";

const useAITrendsNotice = () => {
	const [isVisible, setIsVisible] = useState(false);

	return {
		isVisible,
		setIsVisible,
	};
};

export { useAITrendsNotice };
