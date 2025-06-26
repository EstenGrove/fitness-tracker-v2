import type {
	Medication,
	MedicationDB,
	MedicationSchedule,
	MedicationScheduleDB,
} from "./types.js";

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
const normalizeUserMed = (med: MedicationDB): Medication => {
	const newMed: Medication = {
		userID: med.user_id,
		medicationID: med.medication_id,
		medName: med.med_name,
		dosage: med.dosage,
		quantity: med.quantity,
		refillDate: med.refill_date,
		refillInterval: med.refill_interval,
		isActive: med.is_active,
		createdDate: med.created_date,
	};
	return newMed;
};

const normalizeMedSchedules = (
	schedules: MedicationScheduleDB[]
): MedicationSchedule[] => {
	const newSchedules: MedicationSchedule[] = schedules.map((schedule) => ({
		userID: schedule.user_id,
		medID: schedule.med_id,
		scheduleID: schedule.schedule_id,
		startDate: schedule.start_date,
		endDate: schedule.end_date,
		quantity: schedule.quantity,
		frequency: schedule.frequency,
		dosageDesc: schedule.dosage_desc,
		dosagePerInterval: schedule.dosage_per_interval,
		isActive: schedule.is_active,
		createdDate: schedule.created_date,
	}));

	return newSchedules;
};
const normalizeMedSchedule = (
	schedule: MedicationScheduleDB
): MedicationSchedule => {
	const newSchedule: MedicationSchedule = {
		userID: schedule.user_id,
		medID: schedule.med_id,
		scheduleID: schedule.schedule_id,
		startDate: schedule.start_date,
		endDate: schedule.end_date,
		quantity: schedule.quantity,
		frequency: schedule.frequency,
		dosageDesc: schedule.dosage_desc,
		dosagePerInterval: schedule.dosage_per_interval,
		isActive: schedule.is_active,
		createdDate: schedule.created_date,
	};

	return newSchedule;
};

export {
	normalizeUserMeds,
	normalizeUserMed,
	normalizeMedSchedules,
	normalizeMedSchedule,
};
