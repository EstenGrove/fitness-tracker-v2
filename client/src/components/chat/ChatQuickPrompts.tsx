import styles from "../../css/chat/ChatQuickPrompts.module.scss";
import { ChatSuggestion } from "../../features/chat/types";

type Props = {
	quickPrompts: ChatSuggestion[];
	onSelect: (suggestion: ChatSuggestion) => void;
};

type QuickPromptButtonProps = {
	quickPrompt: ChatSuggestion;
	onSelect: (suggestion?: ChatSuggestion) => void;
};

const QuickPromptButton = ({
	quickPrompt,
	onSelect,
}: QuickPromptButtonProps) => {
	const { content } = quickPrompt;

	const onClick = async () => {
		if (quickPrompt?.onBeforeSend) {
			const result = await quickPrompt?.onBeforeSend(quickPrompt);
			const newPrompt = result ? result : quickPrompt.prompt;
			return (
				onSelect &&
				onSelect({
					...quickPrompt,
					prompt: newPrompt,
				})
			);
		}

		return onSelect && onSelect(quickPrompt);
	};

	return (
		<div className={styles.QuickPromptButton} onClick={onClick}>
			{content}
			{/*  */}
			{/*  */}
		</div>
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
							<QuickPromptButton
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
