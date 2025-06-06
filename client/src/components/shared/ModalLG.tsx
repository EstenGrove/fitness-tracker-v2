import { ReactNode, useRef } from "react";
import styles from "../../css/shared/ModalLG.module.scss";
import { useSwipeDown } from "../../hooks/useSwipeDown";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import { useLockBodyScroll } from "../../hooks/useLockBodyScroll";
import { useBackgroundBlur } from "../../hooks/useBackgroundBlur";
import { createPortal } from "react-dom";

type Props = {
	onClose: () => void;
	children?: ReactNode;
};

const threshold = 100;

const ModalLG = ({ onClose, children }: Props) => {
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
			className={styles.ModalLG}
			style={{ transform: `translateY(${translateY}px)` }}
		>
			<div
				onTouchStart={onTouchStart}
				onTouchMove={onTouchMove}
				onTouchEnd={onTouchEnd}
				className={styles.ModalLG_top}
			>
				<div className={styles.DragHandle}></div>
			</div>
			<div className={styles.ModalLG_main}>{children}</div>
		</div>,
		document.body
	);
};

export default ModalLG;
