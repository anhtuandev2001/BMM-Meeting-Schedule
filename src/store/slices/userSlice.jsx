import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
	role: "",
	isLoading: false,
};

export const userSlice = createSlice({
	name: "user",
	initialState,
	reducers: {
		setUser: (state, action) => {
			Object.assign(state, action.payload);
		},
		setLoading: (state, action) => {
			state.isLoading = action.payload;
		},
	},
});

export const { setUser, setLoading } = userSlice.actions;

export const selectLoading = (state) => state.user.isLoading;

export default userSlice.reducer;
