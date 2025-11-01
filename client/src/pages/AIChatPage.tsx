import { useState } from "react";
import AIChat from "../components/ai/AIChat";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import styles from "../css/pages/AIChatPage.module.scss";
import { chatApis } from "../utils/utils_env";
import { useSelector } from "react-redux";
import { selectCurrentUser } from "../features/user/userSlice";

const NewChatButton = ({ onClick }: { onClick: () => void }) => {
	return (
		<button type="button" onClick={onClick} className={styles.NewChatButton}>
			New Chat
		</button>
	);
};

const chatOpts = {
	endpoint: chatApis.general,
};

const AIChatPage = () => {
	const currentUser = useSelector(selectCurrentUser);
	const [isNewChat, setIsNewChat] = useState<boolean>(false);

	const onNewChat = () => {
		setIsNewChat(true);
	};

	return (
		<PageContainer style={{ height: "100%" }}>
			<div className={styles.AIChatPage}>
				<PageHeader title="AI Chat">
					<NewChatButton onClick={onNewChat} />
				</PageHeader>
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
