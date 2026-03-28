import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import NavArrows from "../components/layout/NavArrows";
import { useNavigate } from "react-router";

const AwardsListPage = () => {
	const navigate = useNavigate();

	const backToAwards = () => {
		navigate("/awards");
	};
	return (
		<PageContainer>
			<NavArrows onBack={backToAwards} />
			<PageHeader title="Awards List" />
		</PageContainer>
	);
};

export default AwardsListPage;
