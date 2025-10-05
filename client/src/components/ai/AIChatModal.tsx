import { ReactNode, useRef } from "react";
import styles from "../../css/ai/AIChatModal.module.scss";
import { createPortal } from "react-dom";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useBackgroundBlur } from "../../hooks/useBackgroundBlur";
import { useSwipeDown } from "../../hooks/useSwipeDown";

type Props = {
	onClose: () => void;
	children?: ReactNode;
};

const threshold = 100;

const AIChatModal = ({ onClose, children }: Props) => {
	const modalRef = useRef<HTMLDivElement>(null);
	useOutsideClick(modalRef, onClose);
	useLockBodyScroll();
	useBackgroundBlur();
	// closes on swipe down after threshold is reached
	const { translateY, onTouchStart, onTouchMove, onTouchEnd } = useSwipeDown(
		threshold,
		onClose
	);

	return createPortal(
		<div
			ref={modalRef}
			className={styles.AIChatModal}
			style={{ transform: `translateY(${translateY}px)` }}
		>
			<div
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				className={styles.AIChatModal_top}
			>
				<div className={styles.DragHandle}></div>
			</div>
			<div className={styles.AIChatModal_main}>{children}</div>
		</div>,
		document.body
	);
};

export default AIChatModal;
