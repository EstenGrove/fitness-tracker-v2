import styles from "../../css/chat/ChatQuickPrompts.module.scss";
import type { QuickPrompt } from "../../features/types";

type Props = {
	quickPrompts: QuickPrompt[];
	onSelect: (suggestion: QuickPrompt) => void;
};

type ChatPromptProps = {
	quickPrompt: QuickPrompt;
	onSelect: () => void;
};

const ChatPrompt = ({ quickPrompt, onSelect }: ChatPromptProps) => {
	const { label, categories } = quickPrompt;
	const title = label.length > 6 ? label.slice(0, 6) + "..." : label;
	const categoryOpts = categories?.join(", ");
	return (
		<button
			type="button"
			onClick={onSelect}
			className={styles.ChatPrompt}
			data-categories={categoryOpts}
		>
			{title}
		</button>
	);
};

const ChatQuickPrompts = ({ quickPrompts, onSelect }: Props) => {
	return (
		<div className={styles.ChatQuickPrompts}>
			<div className={styles.ChatQuickPrompts_inner}>
				{quickPrompts &&
					quickPrompts.map((suggestion, idx) => {
						const { promptID } = suggestion;
						const key = `${promptID}-${idx}`;
						return (
							<ChatPrompt
								key={key}
								quickPrompt={suggestion}
								onSelect={() => onSelect(suggestion)}
							/>
						);
					})}
			</div>
		</div>
	);
};

export default ChatQuickPrompts;
