import styles from "../../css/habits/CreateHabit.module.scss";
import sprite from "../../assets/icons/habits.svg";
import { CurrentUser } from "../../features/user/types";
import TextInput from "../shared/TextInput";
import { HabitFrequency, HabitIntent } from "../../features/habits/types";
import { formatDate } from "../../utils/utils_dates";
import { useForm } from "../../hooks/useForm";
import Select from "../shared/Select";
import TextArea from "../shared/TextArea";
import DatePicker from "../shared/DatePicker";
import MultiStepModal, { StepItem } from "../shared/MultiStepModal";
import NumberInput from "../shared/NumberInput";
import { habitIcons, prepareNewHabit } from "../../utils/utils_habits";
import { useCreateHabitMutation } from "../../features/habits/habitsApi";

type Props = {
	currentUser: CurrentUser;
	onClose: () => void;
};

interface NewHabitValues {
	habitName: string;
	habitDesc: string;
	habitTarget: string;
	habitUnit: string;
	intent: HabitIntent | string;
	frequency: HabitFrequency | string;
	startDate: string;
	endDate: string | null;
	icon: string;
	iconColor: string;
}

const intents = [
	{
		label: "Build",
		value: "BUILD",
	},
	{
		label: "Reduce",
		value: "REDUCE",
	},
	{
		label: "Eliminate",
		value: "ELIMINATE",
	},
	{
		label: "Lapse",
		value: "LAPSE",
	},
];

const freqTypes = [
	"Daily",
	"Weekly",
	"Monthly",
	"Quarterly",
	"Yearly",
	"Custom",
	"None",
];

type FreqProps = {
	onSelect: (name: string, value: string) => void;
	values: NewHabitValues;
};

type FreqOptProps = {
	frequency: string;
	onSelect: () => void;
	isSelected: boolean;
};

const FreqOption = ({
	frequency,
	onSelect,
	isSelected = false,
}: FreqOptProps) => {
	const classes = [styles.FreqOption, isSelected && styles.isSelected].join(
		" "
	);
	return (
		<button type="button" onClick={onSelect} className={classes}>
			{frequency}
		</button>
	);
};

const FrequencyPicker = ({ onSelect, values }: FreqProps) => {
	return (
		<div className={styles.FrequencyPicker}>
			<div className={styles.FrequencyPicker_title}>
				<label htmlFor="frequency">How often?</label>
			</div>
			<div className={styles.FrequencyPicker_options}>
				{freqTypes.map((freq, idx) => {
					return (
						<FreqOption
							key={freq + idx}
							frequency={freq}
							onSelect={() => onSelect("frequency", freq)}
							isSelected={values.frequency === freq}
						/>
					);
				})}
			</div>
		</div>
	);
};

const StepHeader = ({ title }: { title: string }) => {
	return (
		<div className={styles.StepHeader}>
			<h2 className={styles.StepHeader_title}>{title}</h2>
		</div>
	);
};

type StepProps = {
	values: NewHabitValues;
	onChange: (name: string, value: string | number) => void;
	onSelect: (name: string, value: string | Date) => void;
};

type IconProps = {
	icon: keyof typeof habitIcons;
	color: string;
	onSelect: () => void;
	isSelected: boolean;
};
const IconOption = ({
	icon,
	color,
	onSelect,
	isSelected = false,
}: IconProps) => {
	const css = { fill: isSelected ? color : "var(--text2)" };
	const name = habitIcons[icon];

	return (
		<div onClick={onSelect} className={styles.IconOption}>
			<svg className={styles.IconOption_icon} style={css}>
				<use xlinkHref={`${sprite}#icon-${name}`}></use>
			</svg>
		</div>
	);
};

const ColorOption = ({
	color,
	onSelect,
	isSelected = false,
}: {
	color: string;
	isSelected: boolean;
	onSelect: () => void;
}) => {
	const css = { backgroundColor: color };
	return (
		<div
			onClick={onSelect}
			className={styles.ColorOption}
			style={css}
			data-selected={isSelected}
		></div>
	);
};

const colors = [
	"#ff7700",
	"#ff005b",
	"var(--blueGrey900)",
	"#f9f871",
	"#ff333d",
	"#007cff",
	"#00e2bd",
	"rgb(124, 58, 237)",
	"rgb(234, 236, 239)",
];

const HabitCustom = ({ values, onSelect }: StepProps) => {
	const iconOpts = Object.keys(habitIcons);
	return (
		<div className={styles.HabitCustom}>
			<div className={styles.HabitCustom_icons}>
				{iconOpts.map((key, idx) => {
					return (
						<IconOption
							key={idx}
							icon={key as keyof typeof habitIcons}
							color={values.iconColor}
							onSelect={() => onSelect("icon", key)}
							isSelected={values.icon === key || values.icon === ""}
						/>
					);
				})}
			</div>
			<div className={styles.HabitCustom_colors}>
				{colors.map((color, idx) => {
					return (
						<ColorOption
							key={color + idx}
							color={color}
							onSelect={() => onSelect("iconColor", color)}
							isSelected={values.iconColor === color}
						/>
					);
				})}
			</div>
		</div>
	);
};

const AboutStep = ({ values, onChange, onSelect }: StepProps) => {
	return (
		<div className={styles.Step}>
			<StepHeader title="Enter a new habit" />
			<div className={styles.Step_fields}>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="habitName">Habit name</label>
					<TextInput
						name="habitName"
						id="habitName"
						value={values.habitName}
						onChange={onChange}
					/>
				</div>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="habitDesc">Enter a description (optional)</label>
					<TextArea
						name="habitDesc"
						id="habitDesc"
						value={values.habitDesc}
						onChange={onChange}
					/>
				</div>
				<div className={styles.CreateHabit_field}>
					<HabitCustom
						values={values}
						onChange={onChange}
						onSelect={onSelect}
					/>
				</div>
			</div>
		</div>
	);
};
const WhenStep = ({ values, onSelect }: StepProps) => {
	return (
		<div className={styles.Step}>
			<StepHeader title="When does this habit occur?" />
			<div className={styles.Step_fields}>
				<div className={styles.CreateHabit_field}>
					<FrequencyPicker values={values} onSelect={onSelect} />
				</div>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="startDate">Starts on</label>
					<DatePicker
						name="startDate"
						id="startDate"
						value={values.startDate}
						onSelect={onSelect}
					/>
				</div>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="endDate">Ends on</label>
					<DatePicker
						name="endDate"
						id="endDate"
						value={values.endDate as string}
						onSelect={onSelect}
					/>
				</div>
			</div>
		</div>
	);
};

const GoalStep = ({ values, onChange }: StepProps) => {
	return (
		<div className={styles.Step}>
			<StepHeader title="What goal are you striving for?" />
			<div className={styles.Step_fields}>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="intent">Select your habit's intent</label>
					<Select
						name="intent"
						id="intent"
						value={values.intent}
						onChange={onChange}
						options={intents}
						style={{ minWidth: "100%" }}
					/>
				</div>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="habitTarget">Enter your target goal</label>
					<NumberInput
						name="habitTarget"
						id="habitTarget"
						value={values.habitTarget}
						onChange={onChange}
					/>
				</div>
				<div className={styles.CreateHabit_field}>
					<label htmlFor="habitUnit">
						Enter a goal unit (eg. fl oz, water, cigs, etc.)
					</label>
					<TextInput
						name="habitUnit"
						id="habitUnit"
						value={values.habitUnit}
						onChange={onChange}
					/>
				</div>
			</div>
		</div>
	);
};

const CreateHabit = ({ currentUser, onClose }: Props) => {
	const [createHabit] = useCreateHabitMutation();
	const { values, onChange, onSelect } = useForm<NewHabitValues>({
		habitName: "",
		habitDesc: "",
		intent: "REDUCE",
		frequency: "None",
		habitTarget: "",
		habitUnit: "",
		startDate: formatDate(new Date(), "long"),
		endDate: formatDate(new Date(), "long"),
		icon: "",
		iconColor: "",
	});

	const confirmNewHabit = async () => {
		const { userID } = currentUser;
		const newHabitVals = prepareNewHabit(values);
		console.log("values", values);
		console.log("newHabitVals", newHabitVals);
		const params = {
			...newHabitVals,
			userID: userID,
		};

		await createHabit(params);
		onClose();
	};

	const steps: StepItem[] = [
		{
			id: 1,
			title: "About",
			content: (
				<AboutStep values={values} onChange={onChange} onSelect={onSelect} />
			),
			next: 2,
			validate: () => {
				return !!values.habitName && !!values.habitDesc;
			},
		},
		{
			id: 2,
			title: "When?",
			content: (
				<WhenStep values={values} onChange={onChange} onSelect={onSelect} />
			),
			prev: 1,
			next: 3,
			validate: () => {
				return (
					!!values.startDate && !!values.frequency && values.frequency !== ""
				);
			},
		},
		{
			id: 3,
			title: "Goal & Target",
			content: (
				<GoalStep values={values} onChange={onChange} onSelect={onSelect} />
			),
			prev: 2,
			validate: () => {
				return !!values.intent && !!values.habitTarget && !!values.habitUnit;
			},
		},
	];

	return (
		<>
			<MultiStepModal
				steps={steps}
				onClose={onClose}
				onSave={confirmNewHabit}
			/>
		</>
	);
};

export default CreateHabit;
