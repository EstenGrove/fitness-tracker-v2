import {
	NewMedLog,
	useLogMedicationMutation,
} from "../features/medications/medicationsApi";

const useLogMedication = () => {
	const [logMed, { isLoading, error, data }] = useLogMedicationMutation();
	const newLog = data as NewMedLog;

	return {
		data: newLog,
		error: error,
		logMed: logMed,
		isSubmitting: isLoading,
	};
};

export { useLogMedication };
