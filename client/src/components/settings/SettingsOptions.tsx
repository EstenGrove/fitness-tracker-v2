import styles from "../../css/settings/SettingsOptions.module.scss";
import sprite from "../../assets/icons/calendar.svg";
import { SettingOption } from "../../utils/utils_settings";

type Props = {
	options: SettingOption[];
	onSelect: (option: SettingOption) => void;
};

type SettingItemProps = {
	option: SettingOption;
	onSelect: () => void;
};

const SettingItem = ({ option, onSelect }: SettingItemProps) => {
	const { label } = option;

	const onClick = () => {
		onSelect();
	};

	return (
		<li onClick={onClick} className={styles.SettingItem}>
			<div className={styles.SettingItem_label}>{label}</div>
			<svg className={styles.SettingItem_icon}>
				<use xlinkHref={`${sprite}#icon-arrow_forward`}></use>
			</svg>
		</li>
	);
};

const SettingsOptions = ({ options = [], onSelect }: Props) => {
	return (
		<ul className={styles.SettingsOptions}>
			{options &&
				options.length > 0 &&
				options.map((setting, idx) => {
					const key = `${idx}--${setting.id}`;
					return (
						<SettingItem
							key={key}
							option={setting}
							onSelect={() => onSelect(setting)}
						/>
					);
				})}
		</ul>
	);
};

export default SettingsOptions;
