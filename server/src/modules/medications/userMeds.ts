import type { Medication, MedicationDB } from "./types.ts";

const normalizeUserMeds = (meds: MedicationDB[]): Medication[] => {
	if (!meds || !meds.length) return [];

	return meds.map((med) => ({
		userID: med.user_id,
		medicationID: med.medication_id,
		medName: med.med_name,
		dosage: med.dosage,
		quantity: med.quantity,
		refillDate: med.refill_date,
		refillInterval: med.refill_interval,
		isActive: med.is_active,
		createdDate: med.created_date,
	}));
};

export { normalizeUserMeds };
