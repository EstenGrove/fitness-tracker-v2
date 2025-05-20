import { ReactNode } from "react";
import styles from "../../css/shared/ModalWithFooter.module.scss";
import ModalLG from "./ModalLG";
import ModalSM from "./ModalSM";

type Props = {
	size?: "LG" | "MD" | "SM";
	children?: ReactNode;
	footer: ReactNode;
	onClose: () => void;
};

const ModalWithFooter = ({ size, onClose, footer, children }: Props) => {
	const ModalType = {
		LG: ModalLG,
		SM: ModalSM,
	};
	const Modal = ModalType[(size || "LG") as keyof typeof ModalType];

	return (
		<Modal onClose={onClose}>
			<div className={styles.ModalWithFooter}>
				{children}
				<div className={styles.Footer}>{footer}</div>
			</div>
		</Modal>
	);
};

export default ModalWithFooter;
