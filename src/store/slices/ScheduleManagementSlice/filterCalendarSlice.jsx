import { createSlice } from "@reduxjs/toolkit";

const filtersSlice = createSlice({
	name: "filtersCalendar",
	initialState: {
		view: localStorage.getItem("view") || "week",
		room: 0,
		meeting: 7,
		checked: false,
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
		checkboxFilterChange: (state, action) => {
			state.checked = action.payload;
		},
	},
});

export const {
	viewFilterChange,
	roomFilterChange,
	meetingFilterChange,
	checkboxFilterChange,
} = filtersSlice.actions;
export default filtersSlice.reducer;
