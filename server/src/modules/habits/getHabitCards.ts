import { habitsService } from "../../services/index.js";
import type { HabitCard, HabitCardDB } from "./types.js";

const getHabitCards = async (userID: string, targetDate: string) => {
	const cards = (await habitsService.getHabitCards(
		userID,
		targetDate
	)) as HabitCardDB[];

	if (cards instanceof Error) {
		return cards;
	}

	const newCards = cards.map(normalizeHabitCard);

	return newCards;
};

const normalizeHabitCard = (card: HabitCardDB): HabitCard => {
	const newCard: HabitCard = {
		userID: card.user_id,
		habitID: card.habit_id,
		habitName: card.habit_name,
		habitDesc: card.habit_desc,
		intent: card.intent,
		frequency: card.frequency,
		habitTarget: card.habit_target,
		habitUnit: card.habit_unit,
		habitsLogged: card.habits_logged,
		maxStreak: card.max_streak,
		icon: card.icon,
		iconColor: card.icon_color,
		startDate: card.start_date,
		endDate: card.end_date,
	};

	return newCard;
};

export { normalizeHabitCard, getHabitCards };
