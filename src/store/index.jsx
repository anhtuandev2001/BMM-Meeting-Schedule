import { configureStore } from "@reduxjs/toolkit";
import roomManagementReducer from "./slices/roomManagementSlice";
import ScheduleManagementReducer from "./slices/ScheduleManagementSlice/ScheduleManagementSlice";
import filtersReducer from "./slices/ScheduleManagementSlice/filterCalendarSlice";
import userReducer from "./slices/userSlice";
import errorReducer from "./slices/errorSlice";

const store = configureStore({
	reducer: {
		roomManagement: roomManagementReducer,
		scheduleManagement: ScheduleManagementReducer,
		filtersCalendar: filtersReducer,
		user: userReducer,
		error: errorReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
export default store;
