import AchievementBadge from "../components/achievements/AchievementBadge";
import AchievementMedal from "../components/achievements/AchievementMedal";
import PageContainer from "../components/layout/PageContainer";
import PageHeader from "../components/layout/PageHeader";
import StreakMedal from "../components/streaks/StreakMedal";
import StreakTierMedal from "../components/streaks/StreakTierMedal";
import FlameIcon from "../components/ui/FlameIcon";
import styles from "../css/pages/DemoPage.module.scss";
import { useTypewriter } from "../hooks/useTypewriter";

const Flame = () => {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="-5 -10 110 135"
			width="64"
			height="64"
			className={styles.Flame}
		>
			<defs>
				<linearGradient id="outerFlameGradient" x1="0" y1="0" x2="0" y2="1">
					{/* bright orage top */}
					<stop offset="0%" stop-color="#ff6a00" />
					{/* dark red bottom */}
					<stop offset="100%" stop-color="#ff1a00" />
				</linearGradient>

				<linearGradient id="innerFlameGradient" x1="0" y1="0" x2="0" y2="1">
					{/* yellow top */}
					<stop offset="0%" stop-color="#fff700" />
					{/* orange bottom */}
					<stop offset="100%" stop-color="#ff9900" />
				</linearGradient>
			</defs>

			<path
				id="flame-outer"
				d="M48.586 5.7578c0.10156-1.918 2.3242-3.0312 3.9375-1.8164 1.6172 1.2109 1.6172 1.2109 2.3242 1.8164 6.4648 5.3555 10.605 12.121 11.617 20.605 0.60547 5.5547 0 10.91-1.918 16.16-1.5156 4.2422 0.20312 8.5859 4.1406 10.305 2.8281 1.2109 5.5547 0.80859 7.9805-1.0117 0.91016-0.70703 1.5156-2.0195 2.0195-3.332s2.9297-1.8164 3.7383-0.20312c2.8281 5.7578 4.5469 11.816 4.5469 18.383 0 11.211-5.0508 19.797-13.84 26.465-2.5234 1.918-5.2539 3.332-8.2812 4.4453 4.3438-4.0391 6.3633-8.7891 5.4531-14.645-0.40234-2.9297-1.6172-5.3555-3.2305-7.5742-1.6172-2.2227-3.5352-1.3125-4.3438 0.50391-1.918 3.9375-7.0703 4.7461-10.305 1.8164-4.8477-4.4453-6.3633-10.102-5.8594-16.465 0.30469-3.0312 1.8164-7.5742 3.2305-11.312 1.4141-3.7383-1.6172-3.4336-3.1328-2.0195-8.082 7.6758-20.504 24.141-10.809 43.938 1.2109 2.5234 3.0312 4.7461 5.1523 6.668-0.80859-0.30469-1.5156-0.50391-2.3242-0.80859-7.6758-2.9297-14.039-7.5742-18.281-14.746-3.5352-5.9609-4.3438-12.426-3.6367-19.191 1.3125-11.617 6.5664-21.211 14.645-29.496 5.4531-5.5547 10.203-11.617 13.84-18.484 1.6172-3.1328 2.9297-6.3633 3.2305-9.8984z"
				fill="url(#outerFlameGradient)"
			/>

			<path
				id="flame-inner"
				d="M48 15c-5 6-5 12-3 18 2 6 6 4 8 0s3-12 0-18c-2-4-5-4-5-0z"
				fill="url(#innerFlameGradient)"
			/>
		</svg>
	);
};

const Fire = () => {
	return (
		<div className={styles.Fire}>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				version="1.1"
				viewBox="-5.0 -10.0 110.0 135.0"
			>
				<path d="m48.586 5.7578c0.10156-1.918 2.3242-3.0312 3.9375-1.8164 1.6172 1.2109 1.6172 1.2109 2.3242 1.8164 6.4648 5.3555 10.605 12.121 11.617 20.605 0.60547 5.5547 0 10.91-1.918 16.16-1.5156 4.2422 0.20312 8.5859 4.1406 10.305 2.8281 1.2109 5.5547 0.80859 7.9805-1.0117 0.91016-0.70703 1.5156-2.0195 2.0195-3.332s2.9297-1.8164 3.7383-0.20312c2.8281 5.7578 4.5469 11.816 4.5469 18.383 0 11.211-5.0508 19.797-13.84 26.465-2.5234 1.918-5.2539 3.332-8.2812 4.4453 4.3438-4.0391 6.3633-8.7891 5.4531-14.645-0.40234-2.9297-1.6172-5.3555-3.2305-7.5742-1.6172-2.2227-3.5352-1.3125-4.3438 0.50391-1.918 3.9375-7.0703 4.7461-10.305 1.8164-4.8477-4.4453-6.3633-10.102-5.8594-16.465 0.30469-3.0312 1.8164-7.5742 3.2305-11.312 1.4141-3.7383-1.6172-3.4336-3.1328-2.0195-8.082 7.6758-20.504 24.141-10.809 43.938 1.2109 2.5234 3.0312 4.7461 5.1523 6.668-0.80859-0.30469-1.5156-0.50391-2.3242-0.80859-7.6758-2.9297-14.039-7.5742-18.281-14.746-3.5352-5.9609-4.3438-12.426-3.6367-19.191 1.3125-11.617 6.5664-21.211 14.645-29.496 5.4531-5.5547 10.203-11.617 13.84-18.484 1.6172-3.1328 2.9297-6.3633 3.2305-9.8984z" />
			</svg>
		</div>
	);
};

const DemoPage = () => {
	const text = "You've worked out for 69 days in a row. Keep it up!!";
	const typedText = useTypewriter(text);
	return (
		<PageContainer>
			<PageHeader title="Demo Page" />
			<div className={styles.DemoPage}>
				<div>{typedText}</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						placeItems: "center",
					}}
				>
					<FlameIcon variant="purple" glow="none" size="XLG" />
					<div style={{ color: "#fff", fontSize: "1.3rem" }}>69 Day Streak</div>
				</div>
				<div>
					<FlameIcon variant="blue" glow="neon" />
					<FlameIcon variant="green" />
					<FlameIcon variant="pink" glow="neon" />
					<FlameIcon variant="fire" />
					<FlameIcon variant="gold" />
					<FlameIcon variant="grey" />
					<FlameIcon variant="purple" />
					<FlameIcon variant="obsidian" />
					<FlameIcon variant="amber" />
					<FlameIcon variant="crimson" />
				</div>
				<div>
					<FlameIcon variant="blueNeon" />
					<FlameIcon variant="greenNeon" />
					<FlameIcon variant="pinkNeon" />
					<FlameIcon variant="fire" />
					<FlameIcon variant="goldNeon" />
					<FlameIcon variant="greyNeon" />
					<FlameIcon variant="purpleNeon" />
					<FlameIcon variant="crimsonNeon" />
					<FlameIcon variant="prismatic" />
				</div>

				{/* <StreakMedal streak={30} label="Day Streak" /> */}
				<StreakMedal streak={67} label="Weeks Streak" color="blue" />
				<StreakMedal
					streak={67}
					label="Weeks Streak"
					color="fire"
					variant="ascended"
				/>
				<StreakTierMedal streak={365} />
				{/* <Item /> */}
			</div>
		</PageContainer>
	);
};

export default DemoPage;
