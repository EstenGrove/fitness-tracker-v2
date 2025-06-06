import { ReactNode, useRef } from "react";
import styles from "../../css/shared/ModalSM.module.scss";
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

const ModalSM = ({ onClose, children }: Props) => {
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
			className={styles.ModalSM}
			onTouchStart={onTouchStart}
			onTouchMove={onTouchMove}
			onTouchEnd={onTouchEnd}
			style={{ transform: `translateY(${translateY}px)` }}
		>
			<div className={styles.ModalSM_top}>
				<div className={styles.DragHandle}></div>
			</div>
			<div className={styles.ModalSM_main}>{children}</div>
		</div>,
		document.body
	);
};

export default ModalSM;
