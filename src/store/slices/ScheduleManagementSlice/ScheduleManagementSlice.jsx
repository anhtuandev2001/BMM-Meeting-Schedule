/* eslint-disable react-refresh/only-export-components */
// @ts-nocheck
import { createSlice } from "@reduxjs/toolkit";
import {
	createSchedule,
	updateScheduleInfo,
	deleteSchedule,
	getColorSelection,
	getScheduleList,
	ScheduleListHandle,
	updateScheduleOnDrag,
} from "./ScheduleReduce";
import { toast } from "react-toastify";
const initialState = {
	ScheduleList: [],
	FinalScheduleList: [],
	createSchedule: {},
	updateSchedule: {},
	deleteSchedule: {},
	colorSelection: {},
	status: {
		info: "",
		message: "",
	},
};

const ScheduleManagementSlice = createSlice({
	name: "scheduleManagement",
	initialState,
	reducers: {
		handleFinalScheduleList: (state, action) => {
			const schedules = action.payload.ScheduleList;
			const colors = action.payload.colorSelection;
			const result = ScheduleListHandle(schedules, colors);
			state.FinalScheduleList = result;
		},
	},
	extraReducers: (builder) => {
		builder
			//createSchedule
			.addCase(createSchedule.fulfilled, (state, action) => {
				toast.success("Create Successfully");
				state.status = {
					info: "success",
					message: "Success",
				};
				state.createSchedule = action.payload;
			})
			.addCase(createSchedule.rejected, (state, action) => {
				toast.error("This room is used on that time");
				state.status = {
					info: "error",
					message: action.error.message,
				};
				console.log("error :", action);
			})
			// updateSchedule
			.addCase(updateScheduleInfo.fulfilled, (state, action) => {
				toast.success("Update Successfully");
				state.status = {
					info: "success",
					message: "Success",
				};
				state.updateScheduleInfo = action.payload;
			})
			.addCase(updateScheduleInfo.rejected, (state, action) => {
				state.status = {
					info: "error",
					message: action.error.message,
				};
				toast.error("Can't create schedule");
			})
			.addCase(updateScheduleOnDrag.fulfilled, (state, action) => {
				state.status = {
					info: "success",
					message: "success",
				};
				state.updateScheduleInfo = action.payload;
			})
			.addCase(updateScheduleOnDrag.rejected, () => {
				toast.error("Can't update schedule");
			})
			//Delete Schedule
			.addCase(deleteSchedule.fulfilled, (state, action) => {
				state.status = {
					info: "success",
					message: "Success",
				};
				toast.success("Delete success");
				state.deleteSchedule = action.payload;
			})
			.addCase(deleteSchedule.rejected, (state, action) => {
				state.status = {
					info: "error",
					message: action.error.message,
				};
				toast.error("Can't delete schedule");
			})
			// get color
			.addCase(getColorSelection.fulfilled, (state, action) => {
				state.status = {
					info: "fulfilled",
					message: "Success",
				};
				state.colorSelection = action.payload.content;
			})
			.addCase(getColorSelection.rejected, (state) => {
				state.status = {
					info: "error",
					message: "",
				};
			})
			//get Schedule List
			.addCase(getScheduleList.fulfilled, (state, action) => {
				state.status = {
					info: "fulfilled",
					message: "Success",
				};
				state.ScheduleList = action.payload.content;
			})
			.addCase(getScheduleList.rejected, (state) => {
				toast.error("No response from server");
				state.status = {
					info: "error",
					message: "",
				};
				state.ScheduleList = [];
			});
	},
});
export const { handleFinalScheduleList } = ScheduleManagementSlice.actions;
export default ScheduleManagementSlice.reducer;
