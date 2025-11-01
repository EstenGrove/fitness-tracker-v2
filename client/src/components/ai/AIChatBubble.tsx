import styles from "../../css/ai/AIChatBubble.module.scss";
import { parseISO } from "date-fns";
import { AIChatMessage } from "../../features/ai/types";
import { formatDateTime } from "../../utils/utils_dates";

type Props = {
	message: AIChatMessage;
	showTimestamps?: boolean;
};

const dummyMsg =
	"I wanna design a custom AI chat interface. It should support streaming, user responses and allow uploading one or more files. When files are uploaded I want to be able to query the contents of the files and have the AI return summaries and various analysis based on the files content.";

const getCreatedAt = (message: AIChatMessage) => {
	const { createdAt } = message;
	const parsed = parseISO(createdAt);
	const stamp = formatDateTime(parsed, "long");
	return "Created at " + stamp;
};

const AIChatBubble = ({ message, showTimestamps = false }: Props) => {
	const { role, text = dummyMsg } = message;
	const isUserMsg = role === "user";
	const timestamp = getCreatedAt(message);

	if (!isUserMsg) {
		return null;
	}
	return (
		<div className={styles.AIChatBubble}>
			{showTimestamps && (
				<div className={styles.AIChatBubble_timestamp}>
					<div>{timestamp}</div>
				</div>
			)}
			<div className={styles.AIChatBubble_bubble}>
				<div className={styles.AIChatBubble_bubble_text}>{text}</div>
			</div>
		</div>
	);
};

export default AIChatBubble;
