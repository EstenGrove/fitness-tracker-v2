import { settingsService } from "../../services/index.js";

export interface SettingCategoryDB {
	category_id: number;
	category_name: string;
	category_desc: string;
	category_label: string;
	is_active: boolean;
	created_at: string;
}
export interface SettingCategory {
	id: number;
	name: string;
	desc: string;
	label: string;
}

export interface SettingCategoryItemDB {
	id: number;
	label: string;
}

const normalizeCategories = (items: SettingCategoryDB[]): SettingCategory[] => {
	if (!items || !items.length) return [];

	const newItems: SettingCategory[] = items.map((item) => ({
		id: item.category_id,
		name: item.category_name,
		desc: item.category_desc,
		label: item.category_label,
	}));
	return newItems;
};
const normalizeCategoryItems = (
	items: SettingCategoryDB[]
): SettingCategory[] => {
	if (!items || !items.length) return [];

	const newItems: SettingCategory[] = items.map((item) => ({
		id: item.category_id,
		name: item.category_name,
		desc: item.category_desc,
		label: item.category_label,
	}));
	return newItems;
};

const getNavItems = async () => {
	const data = await settingsService.getNavItems();

	if (data instanceof Error) {
		return data;
	}

	const { categories, categoryItems, settingsItems } = data;

	return {
		categories,
		categoryItems,
		settingsItems,
	};
};

export { getNavItems };
