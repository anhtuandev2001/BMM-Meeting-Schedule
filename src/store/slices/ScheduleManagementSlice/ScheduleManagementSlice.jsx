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
	updateScheduleOnDrag: {},
	deleteSchedule: {},
	colorSelection: {},
	status: {
		info: "",
		scheduleColorInfo: "",
		scheduleListInfo: "",
		getSchedule: "",
		updateSchedule: "",
		deleteSchedule: "",
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
			state.status = "";
			state.FinalScheduleList = result;
		},
		clearStatus: (state) => {
			state.status = {
				info: "",
				scheduleColorInfo: "",
				scheduleListInfo: "",
				getSchedule: "",
				updateSchedule: "",
				deleteSchedule: "",
				message: "",
			};
		},
	},
	extraReducers: (builder) => {
		builder
			//createSchedule
			.addCase(createSchedule.fulfilled, (state, action) => {
				toast.success("Create Successfully");
				state.status = {
					...state.status,
					createSchedule: "success",
				};
				state.createSchedule = action.payload;
			})
			.addCase(createSchedule.rejected, (state) => {
				toast.error("This room is used on that time");
				state.status = {
					...state.status,
					createSchedule: "error",
					info: "error",
				};
			})
			// updateSchedule
			.addCase(updateScheduleInfo.fulfilled, (state, action) => {
				toast.success("Update Successfully");
				state.status = {
					...state.status,
					updateSchedule: "success",
					info: "success",
					message: "Success",
				};
				state.updateSchedule = action.payload;
			})
			.addCase(updateScheduleInfo.rejected, (state, action) => {
				state.status = {
					...state.status,
					updateSchedule: "error",
					info: "error",
					message: action.error.message,
				};
				state.updateSchedule = "error";
				toast.error("Can't create schedule");
			})
			.addCase(updateScheduleOnDrag.fulfilled, (state, action) => {
				state.status = {
					...state.status,
					updateSchedule: "success",
					info: "success",
					message: "success",
				};
				state.updateSchedule = action.payload;
				toast.success("update successfully");
			})
			.addCase(updateScheduleOnDrag.rejected, (state) => {
				state.updateSchedule = "error";
				state.status = {
					...state.status,
					updateSchedule: "error",
				};
				toast.error("Can't update schedule");
			})
			//Delete Schedule
			.addCase(deleteSchedule.fulfilled, (state, action) => {
				state.status = {
					...state.status,
					deleteSchedule: "success",
					info: "success",
					message: "Success",
				};
				toast.success("Delete successfully");
				state.deleteSchedule = action.payload;
			})
			.addCase(deleteSchedule.rejected, (state, action) => {
				state.status = {
					...state.status,
					deleteSchedule: "error",
					info: "error",
					message: action.error.message,
				};
				toast.error("Can't delete schedule");
			})
			// get color
			.addCase(getColorSelection.fulfilled, (state, action) => {
				state.status = {
					...state.status,
					scheduleColorInfo: "success",
					message: "Success",
				};
				state.colorSelection = action.payload.content;
			})
			.addCase(getColorSelection.rejected, (state) => {
				state.status = {
					...state.status,
					scheduleColorInfo: "error",
					message: "",
				};
			})
			//get Schedule List
			.addCase(getScheduleList.fulfilled, (state, action) => {
				state.status = {
					...state.status,
					scheduleListInfo: "success",
				};
				state.ScheduleList = action.payload.content;
			})
			.addCase(getScheduleList.rejected, (state) => {
				toast.error("No response from server");
				state.status = {
					...state.status,
					scheduleListInfo: "error",
					message: "",
				};
				state.ScheduleList = [];
			});
	},
});
export const { handleFinalScheduleList, clearStatus } =
	ScheduleManagementSlice.actions;
export default ScheduleManagementSlice.reducer;
