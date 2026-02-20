import React from "react";
import styles from "../../css/errors/ErrorBoundary.module.scss";

/**
 * Usage Examples
 * <ErrorBoundary fallbackRender={({ error, reset }) => <div>Error: {error?.message}</div>}>
 *   <MyComponent />
 * </ErrorBoundary>
 *
 * <ErrorBoundary fallbackRender={({ error, reset }) => <NotFoundPage message={error?.message} goBack={reset} />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */

type Props = {
	children: React.ReactNode;
	fallbackRender?: FallbackRender;
};

type FallbackRender = ({
	error,
	reset,
}: {
	error: Error | null;
	reset: () => void;
}) => React.ReactNode | null | undefined;

interface ErrorState {
	hasError: boolean;
	error: Error | null;
}

class ErrorBoundary extends React.Component<Props, ErrorState> {
	constructor(props: Props) {
		super(props);
		this.state = { hasError: false, error: null };
	}

	static getDerivedStateFromError(error: Error): ErrorState {
		return { hasError: true, error: error };
	}

	componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
		console.log(`[ERROR]: ${error.message}`, errorInfo);
	}

	reset = () => {
		this.setState({ hasError: false, error: null });
	};

	handleRefresh = () => {
		window.location.reload();
	};

	render() {
		const { hasError, error } = this.state;
		const { fallbackRender } = this.props;

		if (hasError) {
			if (fallbackRender) {
				return fallbackRender({ error, reset: this.reset });
			}
			return (
				<div className={styles.ErrorBoundary}>
					<h2 className={styles.ErrorBoundary_title}>
						Oops! Something went wrong.
					</h2>
					{error && (
						<p className={styles.ErrorBoundary_message}>
							ERROR: {error.message}
						</p>
					)}
					{!this.state.error && (
						<p className={styles.ErrorBoundary_message}>
							We're sorry, but an error occurred while processing your request.
						</p>
					)}
					<button
						onClick={this.handleRefresh}
						type="button"
						className={styles.ErrorBoundary_button}
					>
						Refresh Page
					</button>
				</div>
			);
		}
		return this.props.children;
	}
}

export default ErrorBoundary;
