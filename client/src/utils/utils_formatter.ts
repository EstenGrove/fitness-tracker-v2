class NumberFormatter {
	#locale: Intl.LocalesArgument;
	constructor(locale: Intl.LocalesArgument = "en-US") {
		this.#locale = locale;
	}
	// Output: '$1,236,547.50'
	currency(num: number, type: Intl.NumberFormatOptions["currency"] = "USD") {
		const intl = new Intl.NumberFormat(this.#locale, {
			style: "currency",
			currency: type,
		});
		return intl.format(num);
	}

	// Output: '86%' (eg. 0.864)
	percent(num: number, digits: number = 2) {
		const intl = new Intl.NumberFormat(this.#locale, {
			style: "percent",
			maximumFractionDigits: digits,
		});
		return intl.format(num);
	}
	// Output: '1.5K' or '2.3M'
	largeNumber(num: number) {
		const intl = new Intl.NumberFormat(this.#locale, {
			notation: "compact",
			compactDisplay: "short",
		});
		return intl.format(num);
	}
	// Output: '1.2 Million'
	largeNumberDesc(num: number) {
		const intl = new Intl.NumberFormat(this.#locale, {
			notation: "compact",
			compactDisplay: "long",
		});
		return intl.format(num);
	}
}
const numFormatter = new NumberFormatter();

const extractHrsAndMins = (
	totalMinutes: number
): { hrs: number; mins: number } => {
	const hrs = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	return { hrs, mins };
};

export interface IMinsAndSecs {
	minutes: number;
	seconds: number;
}
const timerToMinsAndSecs = (timer: number): IMinsAndSecs => {
	const mins = Math.floor(timer / 60);
	const secs = timer - mins * 60;

	return {
		minutes: mins,
		seconds: secs,
	};
};

const formattedTime = (timer: number) => {
	// format the timerValue => '0:01'
	const { minutes, seconds } = timerToMinsAndSecs(timer);
	const secs = seconds < 10 ? `0${seconds}` : seconds;
	const mins = minutes < 10 ? `0${minutes}` : minutes;
	const newTime = `${mins}:${secs}`;

	return newTime;
};

const formatLargeNumber = (num: number) => {
	return numFormatter.largeNumber(num);
};
const formatMoney = (num: number) => {
	return numFormatter.currency(num);
};
const formatAsPercent = (num: number) => {
	return numFormatter.percent(num);
};

export {
	NumberFormatter,
	numFormatter,
	extractHrsAndMins,
	timerToMinsAndSecs,
	formatMoney,
	formatAsPercent,
	formattedTime,
	formatLargeNumber,
};
