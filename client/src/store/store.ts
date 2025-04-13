import { useDispatch } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
	reducer: {
		//
		//
	},
	// middleware: (getDefaultMiddleware) => {
	// 	//
	// 	//
	// },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

// ALWAYS USE THIS VIA: const dispatch = useAppDispatch();
export const useAppDispatch: () => AppDispatch = useDispatch;

export { store };
