import type { ComponentType } from "react";

/** Props passed from Carousel to each slide component */
export interface CarouselCardProps<TData> {
	data: TData;
	isActive: boolean;
}

/** One carousel slide: payload + component that accepts that payload */
export interface CarouselCard<TData> {
	id: number;
	data: TData;
	render: ComponentType<CarouselCardProps<TData>>;
}

export type CarouselCards<TData> = CarouselCard<TData>[];

/** Build slides from a shared context object (same TData on every card) */
export type CarouselCardBuilder<TData> = (
	data: TData,
) => CarouselCard<TData>[];

/**
 * Heterogeneous slides: define a map of kind → data shape, then union cards.
 *
 * @example
 * type MetricsCardDataMap = { Title: { title: string }; Strength: StrengthData };
 * type MetricsCard = MappedCarouselCard<MetricsCardDataMap>;
 */
export type MappedCarouselCard<
	TDataMap extends Record<string, unknown>,
	TKind extends keyof TDataMap = keyof TDataMap,
> = {
	[K in TKind]: {
		id: number;
		kind: K;
		data: TDataMap[K];
		render: ComponentType<CarouselCardProps<TDataMap[K]>>;
	};
}[TKind];

export type MappedCarouselCardBuilder<
	TDataMap extends Record<string, unknown>,
	TKind extends keyof TDataMap = keyof TDataMap,
> = (data: TDataMap[TKind]) => Extract<MappedCarouselCard<TDataMap>, { kind: TKind }>;

/** Widened slide shape used by Carousel when rendering mixed card types */
export type CarouselSlide = {
	id: number;
	data: unknown;
	render: ComponentType<CarouselCardProps<unknown>>;
};
