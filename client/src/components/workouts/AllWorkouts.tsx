import { act, ChangeEvent, useMemo, useState } from "react";
import styles from "../../css/workouts/AllWorkouts.module.scss";
import { TodaysWorkout as ITodaysWorkouts } from "../../features/workouts/types";
import { groupBy, isEmptyArray } from "../../utils/utils_misc";
import TodaysWorkout from "./TodaysWorkout";

type Props = { workouts: ITodaysWorkouts[] };

const getFiltersFromWorkouts = (workouts: ITodaysWorkouts[]) => {
	if (!workouts || !workouts.length) return [];
	const grouped = groupBy<ITodaysWorkouts>("activityType", workouts);
	return Object.keys(grouped);
};
type FilterProps = {
	type: string;
	isSelected: boolean;
	onClick: () => void;
};
const TypeFilter = ({ type, onClick, isSelected = false }: FilterProps) => {
	const css = [styles.TypeFilter, isSelected && styles.isSelected].join(" ");
	return (
		<button onClick={onClick} className={css} data-selected={isSelected}>
			{type}
		</button>
	);
};

type FiltersProps = {
	filters: string[];
	selected: string[];
	onSelect: (type: string) => void;
};

const isSelected = (target: string, selected: string[]) => {
	if (!selected || !selected.length) return false;

	return selected.includes(target);
};

const TypeFilters = ({ filters, selected = [], onSelect }: FiltersProps) => {
	const noSelections = !selected || !selected.length;
	return (
		<div className={styles.TypeFilters}>
			<div className={styles.TypeFilters_list}>
				<TypeFilter
					type="All"
					isSelected={noSelections}
					onClick={() => onSelect("All")}
				/>
				{filters &&
					filters.map((typeFilter, idx) => {
						const key = `${idx}-${typeFilter}`;
						return (
							<TypeFilter
								key={key}
								type={typeFilter}
								isSelected={isSelected(typeFilter, selected)}
								onClick={() => onSelect(typeFilter)}
							/>
						);
					})}
			</div>
		</div>
	);
};

const filterWorkouts = (
	filters: string[],
	workouts: ITodaysWorkouts[]
): ITodaysWorkouts[] => {
	if (isEmptyArray(filters)) return workouts;
	return workouts.filter((workout) => {
		return isSelected(workout.activityType, filters);
	});
};

const searchWorkouts = (
	value: string,
	workouts: ITodaysWorkouts[]
): ITodaysWorkouts[] => {
	if (!value || value === "") return workouts;

	const lowerVal = value.toLowerCase();
	const numVal = Number(value);

	return workouts.filter((workout) => {
		const { workoutName, activityType, duration, startTime, endTime } = workout;
		// if number, check duration & start/end times
		if (!isNaN(numVal)) {
			return (
				duration === numVal ||
				startTime.includes(value) ||
				endTime.includes(value)
			);
		} else {
			const type = activityType.toLowerCase();
			const lowerName = workoutName.toLowerCase();
			return (
				lowerName.includes(lowerVal) ||
				type.includes(lowerVal) ||
				lowerName.startsWith(lowerVal) ||
				type.startsWith(lowerVal)
			);
		}
	});
};

const searchAndFilter = (
	workouts: ITodaysWorkouts[],
	queries: { search: string; filters: string[] }
) => {
	const { search, filters } = queries;
	const filtered = filterWorkouts(filters, workouts);
	const searched = searchWorkouts(search, filtered);
	return searched;
};

const AllWorkouts = ({ workouts }: Props) => {
	const filters = getFiltersFromWorkouts(workouts);
	const [searchValue, setSearchValue] = useState<string>("");
	const [selectedFilters, setSelectedFilters] = useState<string[]>([]);
	const countDesc = `${selectedFilters.length || 0}/${filters.length || 0}`;
	const filteredWorkouts = useMemo(() => {
		// filter & search

		return searchAndFilter(workouts, {
			search: searchValue,
			filters: selectedFilters,
		});
	}, [selectedFilters, workouts, searchValue]);

	const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
		const { value } = e.target;
		setSearchValue(value);
	};

	const selectFilter = (type: string) => {
		if (type === "All") {
			setSelectedFilters([]);
			return;
		}

		if (selectedFilters.includes(type)) {
			const newFilters = [...selectedFilters].filter((x) => x !== type);
			setSelectedFilters(newFilters);
		} else {
			setSelectedFilters([...selectedFilters, type]);
		}
	};

	console.log("selectedFilters", selectedFilters);

	return (
		<div className={styles.AllWorkouts}>
			<div className={styles.AllWorkouts_header}>
				<div className={styles.AllWorkouts_search}>
					<input
						type="text"
						name="search"
						id="search"
						value={searchValue}
						onChange={handleSearch}
						placeholder="Search workouts..."
						className={styles.AllWorkouts_search_input}
					/>
				</div>
				<div className={styles.AllWorkouts_filters}>
					<div className={styles.AllWorkouts_filters_counts}>{countDesc}</div>
					<TypeFilters
						filters={filters}
						selected={selectedFilters}
						onSelect={selectFilter}
					/>
				</div>
			</div>
			<div className={styles.AllWorkouts_list}>
				{filteredWorkouts &&
					filteredWorkouts.map((workout, idx) => {
						const key = `${idx}-${workout.workoutID}`;
						return <TodaysWorkout key={key} workout={workout} />;
					})}
			</div>
		</div>
	);
};

export default AllWorkouts;
