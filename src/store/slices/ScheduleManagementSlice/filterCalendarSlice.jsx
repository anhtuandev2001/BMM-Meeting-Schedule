import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
	name: "filtersCalendar",
	initialState: {
		view: localStorage.getItem("view") || "week",
		room: 0,
		meeting: 7,
	},
	reducers: {
		viewFilterChange: (state, action) => {
			state.view = action.payload;
		},
		roomFilterChange: (state, action) => {
			state.room = action.payload;
		},
		meetingFilterChange: (state, action) => {
			state.meeting = action.payload;
		},
	},
});

export const { viewFilterChange, roomFilterChange, meetingFilterChange } =
	filtersSlice.actions;
export default filtersSlice.reducer;
