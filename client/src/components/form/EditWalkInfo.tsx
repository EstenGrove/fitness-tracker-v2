import styles from "../../css/form/EditWalkInfo.module.scss";
import NumberInput from "../shared/NumberInput";
import { milesToSteps } from "../../utils/utils_steps";

type Props = {
	miles: number;
	duration: number;
	onChange: (name: string, value: string | number) => void;
};

const EditWalkInfo = ({ miles, onChange }: Props) => {
	const stepsFromMiles = milesToSteps(miles) || 0;

	const handleChange = (name: string, value: string | number) => {
		onChange(name, value);
	};

	return (
		<div className={styles.EditWalkInfo}>
			<div className={styles.EditWalkInfo_miles}>
				<label htmlFor="miles">Miles: ({stepsFromMiles} steps)</label>
				<NumberInput
					name="miles"
					value={miles}
					min={0}
					step={0.01}
					onChange={handleChange}
					style={{ width: "15rem" }}
					inputMode="decimal"
				/>
				{/* <div className={styles.EditWalkInfo_pace}>
					Pace: {paceFromMiles.toFixed(2)}'/sec
				</div> */}
			</div>
		</div>
	);
};

export default EditWalkInfo;
