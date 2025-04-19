const milesToSteps = (miles: number, stride: number = 2.5) => {
	const factor = 5280 / stride; // 5280 feet in a mile
	return Math.round(miles * factor);
};

const milesToPace = (miles: number, minutes: number) => {
	if (miles <= 0 || minutes <= 0) return 0;
	const pace = minutes / miles; // pace in minutes per mile
	return pace;
};

const pacePerMile = (miles: number, steps: number, minutes: number) => {
	if (miles <= 0 || steps <= 0 || minutes <= 0) return 0;
	const pace = (minutes * steps) / (miles * 5280); // pace in minutes per mile
	return pace;
};

export { milesToSteps, milesToPace, pacePerMile };
