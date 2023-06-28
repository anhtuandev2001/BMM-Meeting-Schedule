import { createSlice } from "@reduxjs/toolkit";

const initialState = {
	username: "",
	email: "",
	password: "",
	confirmPassword: "",
};

const errorSlice = createSlice({
	name: "error",
	initialState,
	reducers: {
		setError: (state, action) => {
			return {
				...state,
				...action.payload,
			};
		},
		clearError: () => {
			return {
				username: "",
				email: "",
				password: "",
				confirmPassword: "",
			};
		},
	},
});

export const { setError, clearError } = errorSlice.actions;
export default errorSlice.reducer;
