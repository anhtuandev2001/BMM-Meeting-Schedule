import { createSlice } from "@reduxjs/toolkit";

const avatarSlice = createSlice({
	name: "avatarUrl",
	initialState: {
		url: "",
	},
	reducers: {
		handleAvatarUrl: (state, action) => {
			state.url = action.payload;
		},
	},
});

export const { handleAvatarUrl } = avatarSlice.actions;
export default avatarSlice.reducer;
