import { useState } from "react";
import AIChat from "../components/ai/AIChat";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/AIChatPage.module.scss";
import { chatApis } from "../utils/utils_env";
import { ChatSuggestion } from "../features/chat/types";
import { subDays } from "date-fns";
import { formatDate } from "../utils/utils_dates";

// DEFAULT SUGGESTIONS
const SummarizeSuggestion = () => {
	return (
		<button className={styles.SummarizeSuggestion}>Summarize Workouts</button>
	);
};
const GeneratePlanSuggestion = () => {
	return (
		<button className={styles.GeneratePlanSuggestion}>
			Generate Workout Plan
		</button>
	);
};

const getLastXDaysRange = (lastXDays: number = 60) => {
	const today = new Date();
	const start = subDays(today, lastXDays);

	return {
		startDate: formatDate(start, "db"),
		endDate: formatDate(today, "db"),
	};
};

const last60 = getLastXDaysRange(60);

const DEFAULT_SUGGESTIONS: ChatSuggestion[] = [
	{
		promptID: 1,
		prompt: `What was my workout history from ${last60.startDate} to ${last60.endDate}`,
		content: <SummarizeSuggestion />,
		categories: ["workouts", "history", "summary"],
	},
	{
		promptID: 2,
		prompt: "Generate a workout plan based off my recent workout history",
		content: <GeneratePlanSuggestion />,
		categories: ["workouts", "history", "plan"],
	},
];

const NewChatButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.NewChatButton}>
			New Chat
		</button>
	);
};

const chatOpts = {
	endpoint: chatApis.summary,
};

const AIChatPage = () => {
	const [isNewChat, setIsNewChat] = useState<boolean>(false);

	const onNewChat = () => {
		setIsNewChat(true);
	};

	return (
		<PageContainer padding="0 2rem" style={{ height: "88%" }}>
			<div className={styles.AIChatPage}>
				<div className={styles.AIChatPage_header}>
					<PageHeader title="AI Chat" styles={{ height: "12rem" }}>
						<NewChatButton onClick={onNewChat} />
					</PageHeader>
				</div>
				<div className={styles.AIChatPage_main}>
					<AIChat
						endpoint={chatOpts.endpoint}
						isNewChat={isNewChat}
						suggestions={DEFAULT_SUGGESTIONS}
					/>
				</div>
			</div>
		</PageContainer>
	);
};

export default AIChatPage;
