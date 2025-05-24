export type AlertType = "INFO" | "WARN" | "ERROR";

const alertIcons = {
	warning: "warning",
	error: "error",
	error2: "error_outline",
} as const;

export { alertIcons };
