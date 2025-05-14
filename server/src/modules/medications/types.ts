export interface MedicationDB {
	user_id: string;
	medication_id: number;
	med_name: string;
	dosage: string;
	quantity: number;
	refill_date: string;
	refill_interval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
	is_active: boolean;
	created_date: string;
}
export interface Medication {
	userID: string;
	medicationID: number;
	medName: string;
	dosage: string;
	quantity: number;
	refillDate: string;
	refillInterval: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
	isActive: boolean;
	createdDate: string;
}
export interface MedicationScheduleDB {
	user_id: string;
	med_id: number;
	schedule_id: number;
	start_date: string;
	end_date: string;
	dosage_desc: string;
	dosage_per_interval: number;
	frequency: string;
	quantity: number;
	is_active: boolean;
	created_date: string;
}
export interface MedicationSchedule {
	userID: string;
	medID: number;
	scheduleID: number;
	startDate: string;
	endDate: string;
	dosageDesc: string;
	dosagePerInterval: number;
	frequency: string;
	quantity: number;
	isActive: boolean;
	createdDate: string;
}

export interface PillSummaryDB {
	schedule_id: number;
	total_pills: number;
	total_pills_taken: number;
	total_pills_taken_today: number;
	total_pills_remaining: number;
	days_left: number;
}
export interface PillSummary {
	scheduleID: number;
	totalPills: number;
	pillsTaken: number;
	pillsTakenToday: number;
	pillsRemaining: number;
	daysLeft: number;
}

export interface MedicationLogDB {
	log_id: number;
	schedule_id: number;
	logged_at: string;
	dose: number;
	notes: string;
	created_date: string;
}
export interface MedicationLog {
	logID: number;
	scheduleID: number;
	loggedAt: string;
	dose: number;
	notes: string;
	createdDate: string;
}

export interface LogMedBody {
	userID: string;
	medID: number;
	scheduleID: number;
	amountTaken: number;
	action: "Taken" | "Skipped";
	loggedAt: Date | string;
}

export interface MedSummaryDB {
	pillSummary: PillSummaryDB;
	medicationLogs: MedicationLogDB[];
}
export interface MedSummary {
	pillSummary: PillSummary;
	medicationLogs: MedicationLog[];
}

export interface MedsInfoDB {
	activeMeds: MedicationDB[];
	activeSchedules: MedicationScheduleDB[];
}
export interface MedsInfo {
	activeMeds: Medication[];
	activeSchedules: MedicationSchedule[];
}
