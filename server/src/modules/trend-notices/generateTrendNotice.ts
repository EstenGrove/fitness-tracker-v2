import { generateText } from "ai";
import { AI_MODELS } from "../chat/models.js";
import { TREND_NOTICE_PROMPT } from "./prompts.js";
import type {
	AINoticeContent,
	AINoticeMetric,
	AINoticeMetrics,
	DetectedAITrend,
} from "./types.js";

const { google } = AI_MODELS;

const AI_TIMEOUT_MS = 10000;

const METRIC_LABELS: Record<keyof AINoticeMetrics, string> = {
	avgWeeklyMins: "minutes",
	avgWeeklyWorkouts: "workouts",
};

type NotableMetric = AINoticeMetric & { label: string };

const getNotableMetrics = (metrics: AINoticeMetrics): NotableMetric[] => {
	const keys = Object.keys(metrics) as Array<keyof AINoticeMetrics>;
	return keys
		.map((key) => ({ ...metrics[key], label: METRIC_LABELS[key] }))
		.filter((metric) => metric.direction !== "STABLE");
};

const joinLabels = (metrics: NotableMetric[]): string => {
	return metrics.map((metric) => metric.label).join(" and ");
};

// Deterministic, so numbers are never model-generated. eg. "Weekly minutes up 27%, workouts down 22%"
const buildTitle = (trend: DetectedAITrend): string => {
	const parts = getNotableMetrics(trend.metrics).map((metric) => {
		const change = metric.direction === "POSITIVE" ? "up" : "down";
		const pct = Math.round(Math.abs(metric.pctChange));
		return `${metric.label} ${change} ${pct}%`;
	});
	return `Weekly ${parts.join(", ")}`;
};

// Used when the AI call fails, so the notice still appears
const buildTemplateMessage = (trend: DetectedAITrend): string => {
	const notable = getNotableMetrics(trend.metrics);
	const ups = notable.filter((metric) => metric.direction === "POSITIVE");
	const downs = notable.filter((metric) => metric.direction === "NEGATIVE");

	switch (trend.direction) {
		case "POSITIVE":
			return `There's been a notable increase in your average weekly workout ${joinLabels(ups)}. Great job!`;
		case "NEGATIVE":
			return `Your average weekly workout ${joinLabels(downs)} dipped a bit lately, and that's completely okay. Even one short session this week is a great way to ease back into your rhythm.`;
		case "MIXED":
			return `Your average weekly workout ${joinLabels(ups)} went up while your ${joinLabels(downs)} went down. Every bit of movement counts, so keep it going!`;
	}
};

const generateTrendMessage = async (trend: DetectedAITrend): Promise<string> => {
	const result = await generateText({
		model: google,
		system: TREND_NOTICE_PROMPT,
		messages: [{ role: "user", content: JSON.stringify(trend) }],
		maxRetries: 1,
		abortSignal: AbortSignal.timeout(AI_TIMEOUT_MS),
	});
	const message = result.text.trim();

	if (!message) {
		throw new Error("AI returned an empty trend notice message");
	}
	return message;
};

const generateTrendNotice = async (
	trend: DetectedAITrend,
): Promise<AINoticeContent> => {
	const title = buildTitle(trend);

	try {
		const message = await generateTrendMessage(trend);
		return { title, message, generatedBy: "AI" };
	} catch (error) {
		console.error("[TREND NOTICE]: AI generation failed, using template", error);
		const message = buildTemplateMessage(trend);
		return { title, message, generatedBy: "TEMPLATE" };
	}
};

export { generateTrendNotice, buildTitle, buildTemplateMessage };
