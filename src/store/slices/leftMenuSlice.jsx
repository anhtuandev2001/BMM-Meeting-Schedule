import { createSlice } from "@reduxjs/toolkit";

const leftMenuSlice = createSlice({
	name: "leftMenu",
	initialState: {
		showMenu: true,
	},
	reducers: {
		handleLeftMenu: (state, action) => {
			state.showMenu = action.payload;
		},
	},
});

export const { handleLeftMenu } = leftMenuSlice.actions;
export default leftMenuSlice.reducer;

