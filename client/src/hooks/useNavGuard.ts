import { useEffect } from "react";
import { useBlocker } from "react-router";

export interface BlockOptions {
	route?: boolean; // React-Router route change
	unload?: boolean; // Page unload/refresh
	close?: boolean; // Browser Tab close
}

export interface InterceptArgs {
	type: string;
	proceed?: () => void;
	reset?: () => void;
}

export type InterceptCB = (opts: InterceptArgs) => void;

export interface GuardOptions {
	when: boolean; // Condition that should block/intercept
	block: BlockOptions; // Blocking options, (what events should intercept/block)
	onIntercept: InterceptCB; // Callback w/ info about the intercept event
}

/**
 * 'useNavGuard': handles intercepting/blocking reloads/refresh/navigations/tab-closing
 * - We define the condition for 'when' we should intercept
 * - Then we define what kind of events should be intercepted
 *
 * @example
 * useNavGuard({
 *   when: isActiveWorkout,
 *   block: { route: true, close: true },
 *   onIntercept: ({ type, proceed, reset }) => {
 *     if(type === 'route') {
 *       const confirmed = window.confirm("Workout in-progress - leavey anyway?")
 *       if(confirmed) proceed();
 *       else reset?.();
 *     } else if (type === 'close') {
 *       console.log("User attempted to close the tab during an active workout!!!")
 *     }
 *   }
 * })
 * @example
 * 	useNavGuard({
 * 		when: true,
 * 		block: { route: true, close: true, unload: true },
 * 		onIntercept: ({ type, proceed, reset }) => {
 * 			console.log("type:", type);
 * 			return reset && reset();
 * 		},
 * });
 */

const useNavGuard = (options: GuardOptions) => {
	const { when, block, onIntercept } = options;
	const blocker = useBlocker(Boolean(when && block?.route));

	useEffect(() => {
		// React-Router route change (eg in-app)
		if (blocker.state === "blocked") {
			onIntercept({
				type: "route",
				proceed: blocker.proceed,
				reset: blocker.reset,
			});
		}
	}, [blocker.proceed, blocker.reset, blocker.state, onIntercept]);

	useEffect(() => {
		const handleBeforeUnload = (event: BeforeUnloadEvent) => {
			if (!when) return;

			// Browser reload/unload or closing the tab
			if (block.unload || block.close) {
				onIntercept({
					type: block?.unload ? "unload" : "close",
					proceed: () => {}, // noop
				});
			}

			// Browser unload/refresh; we prevent the event's action via e.preventDefault();
			if (block.unload) {
				event.preventDefault();
				event.returnValue = "";
			}
		};

		if (block.unload || block.close) {
			window.addEventListener("beforeunload", handleBeforeUnload);
		}

		return () => {
			window.removeEventListener("beforeunload", handleBeforeUnload);
		};
	}, [block.close, block.unload, onIntercept, when]);
};

export { useNavGuard };
