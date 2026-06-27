import {
	AchievementDisplay,
	AchievementDisplayTier,
	AwardCategory,
	WorkoutAward,
} from "../features/awards/types";

const achievementIcons = {
	trophy: "trophy",
	trophy2: "trophy-2",
	trophy3: "trophy-3",
	star: "army-star",
	star2: "army-star-2",
	star3: "army-star-3",
	medal: "medal",
	medal2: "medal-2",
	medal3: "medal-3",
	medal4: "medal-4",
	medal2_2: "medal2-2",
	medal2_3: "medal2-3",
	medal1st: "medal-first-place",
	medal2nd: "medal-second-place",
	medal2nd2: "medal-second-place-2",
	medal3rd: "medal-third-place",
	badgeSimple: "best-seller",
	badgeSimple2: "best-seller-2",
	certificate: "certificate",
	certificate2: "certificate-2",
	certificate3: "certificate-3",
	certificate4: "certificate-4",
	stamp: "verified-account",
	stamp2: "verified-account-2",
	stamp3: "verified-account-3",
	prize: "prize",
	prize2: "prize-2",
	badge: "guarantee",
	badge2: "guarantee-2",
	badge3: "warranty",
	badge4: "warranty-2",
} as const;

const badgeIcons = {
	badgeSimple: "best-seller",
	badgeSimple2: "best-seller-2",
	badge: "guarantee",
	badge2: "guarantee-2",
	badge3: "warranty",
	badge4: "warranty-2",
} as const;
const medalIcons = {
	medal: "medal",
	medal2: "medal-2",
	medal3: "medal-3",
	medal4: "medal-4",
	medal2_2: "medal2-2",
	medal2_3: "medal2-3",
	medal1st: "medal-first-place",
	medal2nd: "medal-second-place",
	medal2nd2: "medal-second-place-2",
	medal3rd: "medal-third-place",
} as const;

const trophyIcons = {
	trophy: "trophy",
	trophy2: "trophy-2",
	trophy3: "trophy-3",
	star: "army-star",
	star2: "army-star-2",
	star3: "army-star-3",
} as const;

const streakIcons = {
	streak1: "medal",
	streak2: "medal-second-place",
	streak3: "medal-third-place",
	streak5: "medal-2",
	streak7: "gas_industry",
} as const;

const awardIcons = {
	badges: badgeIcons,
	trophies: trophyIcons,
	medals: medalIcons,
	streaks: streakIcons,
};

const getAchievementDisplayTier = (
	award: WorkoutAward,
): AchievementDisplayTier => {
	const threshold = award.awardThreshold;
	// Non-positive thresholds: safe default (adjust if your API never sends these)
	if (!(threshold > 0) || threshold < 3) {
		return { color: "slate" };
	}
	// Low target → calmer color, no variant
	if (threshold < 25) {
		return { color: "blue" };
	}
	if (threshold < 50) {
		return { color: "teal" };
	}
	if (threshold < 75) {
		return { color: "green" };
	}
	if (threshold < 100) {
		return { color: "gold", variant: "inferno" };
	}
	if (threshold < 150) {
		return { color: "purple", variant: "mythic" };
	}
	// High target → strongest pairing
	return { color: "fire", variant: "ascended" };
};

const getAchievementNthDisplay = (award: WorkoutAward): AchievementDisplay => {
	const { awardName, awardDesc, achievedOn, wasAchieved } = award;
	const tier = getAchievementDisplayTier(award);
	return {
		title: awardName,
		label: awardDesc,
		shape: "circle",
		color: tier.color,
		variant: tier?.variant,
		category: AwardCategory.NTH,
		achievedOn: achievedOn,
		wasAchieved: wasAchieved,
	};
};

const getAchievementPatternDisplay = (
	award: WorkoutAward,
): AchievementDisplay => {
	const { awardName, awardDesc, achievedOn, wasAchieved } = award;
	const tier = getAchievementDisplayTier(award);
	return {
		title: awardName,
		label: awardDesc,
		shape: "circle",
		color: tier.color,
		variant: tier?.variant,
		category: AwardCategory.PATTERN,
		achievedOn: achievedOn,
		wasAchieved: wasAchieved,
	};
};

const getAchievementRecordDisplay = (
	award: WorkoutAward,
): AchievementDisplay => {
	const { awardName, awardDesc, achievedOn, wasAchieved } = award;
	const tier = getAchievementDisplayTier(award);
	return {
		title: awardName,
		label: awardDesc,
		shape: "circle",
		color: tier.color,
		variant: tier?.variant,
		category: AwardCategory.RECORD,
		achievedOn: achievedOn,
		wasAchieved: wasAchieved,
	};
};

const getAchievementOtherDisplay = (
	award: WorkoutAward,
): AchievementDisplay => {
	const { awardName, awardDesc, achievedOn, wasAchieved } = award;
	const tier = getAchievementDisplayTier(award);
	return {
		title: awardName,
		label: awardDesc,
		shape: "circle",
		color: tier.color,
		variant: tier?.variant,
		category: AwardCategory.OTHER,
		achievedOn: achievedOn,
		wasAchieved: wasAchieved,
	};
};

// STREAK, NTH, PATTERN, RECORD
const getAchievementDisplay = (award: WorkoutAward): AchievementDisplay => {
	switch (award.awardCategory) {
		case AwardCategory.NTH: {
			const display = getAchievementNthDisplay(award);
			return display;
		}
		case AwardCategory.PATTERN: {
			const display = getAchievementPatternDisplay(award);
			return display;
		}
		case AwardCategory.RECORD: {
			const display = getAchievementRecordDisplay(award);
			return display;
		}
		default: {
			const display = getAchievementOtherDisplay(award);
			return display;
		}
	}
};

export {
	achievementIcons,
	badgeIcons,
	medalIcons,
	trophyIcons,
	streakIcons,
	awardIcons,
	getAchievementDisplay,
	getAchievementDisplayTier,
};
