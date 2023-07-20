import { configureStore } from "@reduxjs/toolkit";
import roomManagementReducer from "./slices/roomManagementSlice";
import ScheduleManagementReducer from "./slices/ScheduleManagementSlice/ScheduleManagementSlice";
import filtersReducer from "./slices/ScheduleManagementSlice/filterCalendarSlice";
import userReducer from "./slices/userSlice";
import errorReducer from "./slices/errorSlice";
import loadingReducer from "./slices/loadingSlice";
import avatarUrlReducer from "./slices/avatarUrl";
import leftMenuReducer from "./slices/leftMenuSlice";

const store = configureStore({
	reducer: {
		avatarUrl: avatarUrlReducer,
		loading: loadingReducer,
		roomManagement: roomManagementReducer,
		scheduleManagement: ScheduleManagementReducer,
		filtersCalendar: filtersReducer,
		user: userReducer,
		error: errorReducer,
		leftMenu: leftMenuReducer,
	},
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware({
			serializableCheck: false,
		}),
});
export default store;
