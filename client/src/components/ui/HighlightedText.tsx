import { CSSProperties } from "react";

export interface HighlightItem {
	text: string;
	color: string;
	showHighlight: boolean;
}

type Props = {
	highlights: HighlightItem[];
	style?: CSSProperties;
};

const HighlightedText = ({ highlights = [], style }: Props) => {
	return (
		<>
			{highlights.map((part, idx) => {
				const { text, color, showHighlight } = part;
				const css = { color: showHighlight ? color : "initial" };
				return (
					<span key={idx} style={{ ...style, ...css }}>
						{text}
					</span>
				);
			})}
		</>
	);
};

export default HighlightedText;
