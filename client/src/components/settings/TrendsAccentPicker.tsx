import { ChangeEvent } from "react";
import styles from "../../css/settings/TrendsAccentPicker.module.scss";
import { TrendTone } from "../../features/trends-hub/types";
import { useTrendsAccent } from "../../hooks/useTrendsAccent";
import {
	getAccentToneConflict,
	TRENDS_ACCENT_PRESETS,
} from "../../utils/utils_trendsHub";

// Heights (%) for the preview bars
const PREVIEW_BARS = [45, 60, 52, 75, 68, 88, 80];

const CONFLICT_HINTS: Partial<Record<TrendTone, string>> = {
	POSITIVE:
		"This is close to the green used for improvements, so charts may be harder to read.",
	NEGATIVE:
		"This is close to the amber used for declines, so charts may be harder to read.",
};

const isSameColor = (a: string, b: string) =>
	a.toLowerCase() === b.toLowerCase();

// Picks the trends hub's accent: a preset swatch or any custom color
const TrendsAccentPicker = () => {
	const { accent, isCustom, setAccent, resetAccent } = useTrendsAccent();
	const isPreset = TRENDS_ACCENT_PRESETS.some(({ color }) =>
		isSameColor(color, accent),
	);
	const conflict = getAccentToneConflict(accent);
	const hint = conflict ? CONFLICT_HINTS[conflict] : null;

	const handleCustomColor = (e: ChangeEvent<HTMLInputElement>) => {
		setAccent(e.target.value);
	};

	return (
		<div className={styles.TrendsAccentPicker}>
			<p className={styles.TrendsAccentPicker_desc}>
				Used for charts and bars on your Trends pages.
			</p>

			<div
				className={styles.Swatches}
				role="radiogroup"
				aria-label="Trends accent color"
			>
				{TRENDS_ACCENT_PRESETS.map((preset) => {
					const isSelected = isSameColor(preset.color, accent);
					return (
						<button
							key={preset.color}
							type="button"
							role="radio"
							aria-checked={isSelected}
							aria-label={preset.label}
							title={preset.label}
							className={styles.Swatch}
							data-selected={isSelected}
							style={{ backgroundColor: preset.color }}
							onClick={() => setAccent(preset.color)}
						/>
					);
				})}
				<label
					className={styles.Swatch_custom}
					data-selected={!isPreset}
					title="Custom color"
					style={isPreset ? undefined : { backgroundColor: accent }}
				>
					<input
						type="color"
						className={styles.Swatch_input}
						value={accent}
						onChange={handleCustomColor}
						aria-label="Custom color"
					/>
					{isPreset && (
						<span className={styles.Swatch_customLabel}>Custom</span>
					)}
				</label>
			</div>

			<div className={styles.Preview} aria-hidden="true">
				{PREVIEW_BARS.map((height, idx) => (
					<span
						key={idx}
						className={styles.Preview_bar}
						style={{ height: `${height}%`, backgroundColor: accent }}
					/>
				))}
			</div>

			{hint && <p className={styles.TrendsAccentPicker_hint}>{hint}</p>}

			{isCustom && (
				<button
					type="button"
					className={styles.TrendsAccentPicker_reset}
					onClick={resetAccent}
				>
					Reset to default
				</button>
			)}
		</div>
	);
};

export default TrendsAccentPicker;
