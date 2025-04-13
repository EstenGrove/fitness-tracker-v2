import { useLayoutEffect } from "react";

/**
 * Locks scrolling on the 'body' when active, then reverts to the previous settings when inactive
 */

export const useLockBodyScroll = () => {
	useLayoutEffect(() => {
		// Get original value of body overflow
		const originalStyle: string = window.getComputedStyle(
			document.body
		).overflow;
		// Prevent scrolling on mount
		document.body.style.overflow = "hidden";
		// Re-enable scrolling when component unmounts
		return () => {
			document.body.style.overflow = originalStyle;
		};
	}, []); // Empty array ensures effect is only run on mount and unmount
};
