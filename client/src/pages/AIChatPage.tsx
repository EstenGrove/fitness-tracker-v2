import { useState } from "react";
import AIChat from "../components/ai/AIChat";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/AIChatPage.module.scss";
import { chatApis } from "../utils/utils_env";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";
// import { useNavGuard } from "../hooks/useNavGuard";

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
	const currentUser = useSelector(selectCurrentUser);
	const [isNewChat, setIsNewChat] = useState<boolean>(false);
	// useNavGuard({
	// 	when: true,
	// 	block: { route: true, close: true, unload: true },
	// 	onIntercept: ({ type, proceed, reset }) => {
	// 		console.log("type:", type);
	// 		return reset && reset();
	// 	},
	// });

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
						currentUser={currentUser}
						endpoint={chatOpts.endpoint}
						isNewChat={isNewChat}
						suggestions={[]}
					/>
				</div>
			</div>
		</PageContainer>
	);
};

export default AIChatPage;
