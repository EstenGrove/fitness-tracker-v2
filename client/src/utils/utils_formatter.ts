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

const extractHrsAndMins = (
	totalMinutes: number
): { hrs: number; mins: number } => {
	const hrs = Math.floor(totalMinutes / 60);
	const mins = totalMinutes % 60;
	return { hrs, mins };
};

export { NumberFormatter, extractHrsAndMins };
