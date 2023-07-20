/* eslint-disable react-refresh/only-export-components */
// @ts-nocheck
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { FakeTableData } from "../../assets/mockData/TableData/FakeTableData";
import { toast } from "react-toastify";
import {
	ConfigColumns,
	InitialColumns,
} from "../../assets/mockData/TableData/InitialColumns";
const initialState = {
	newRoom: {},
	roomsBooked: FakeTableData,
	updateRoom: {},
	deleteRoom: {},
	lockRoom: {},
	colorSelection: {},
	sortDirection: "asc",
	sortBy: "id",
	status: false,
	nonIdealStateStatus: false,
	statusOfRoom: "",
	statusOfDialog: "idle",
	columns: ConfigColumns || InitialColumns,
	getRoomListStatus: "",
	searchListRoomsBooked: [],
	error: "",
};
const baseURL = "http://localhost:4001/api";

const ASYNC_ACTION = {
	CREATE_MEETING_ROOM: "api/room",
	GET_ROOM_LIST: "get/api/room",
	GET_ROOM_BY_ID: "get/api/room/{id}",
	UPDATE_ROOM_INFOR: "put/api/room/{id}",
	DELETE_MEETING_ROOM: "delete/api/room/{id}",
	LOCK_MEETING_ROOM: "lock/api/room/{id}",
	GET_COLOR_SELECTION: "get/api/calendar/color",
};
const createMeetingRoom = createAsyncThunk(
	ASYNC_ACTION.CREATE_MEETING_ROOM,
	async (params) => {
		const results = await axios.post(`${baseURL}/room`, params);
		return results.data;
	},
);

const getRoomList = createAsyncThunk(ASYNC_ACTION.GET_ROOM_LIST, async () => {
	const results = await axios.get(`${baseURL}/room`);
	return results.data.content;
});

const updateRoomInfor = createAsyncThunk(
	ASYNC_ACTION.UPDATE_ROOM_INFOR,
	async (data) => {
		const results = await axios.put(
			`${baseURL}/room/${data.id}`,
			data.dataEditRoom,
		);
		return results.data;
	},
);

const deleteMeetingRoom = createAsyncThunk(
	ASYNC_ACTION.DELETE_MEETING_ROOM,
	async (id) => {
		const results = await axios.delete(`${baseURL}/room/${id}`);
		return results.data;
	},
);

const lockMeetingRoom = createAsyncThunk(
	ASYNC_ACTION.LOCK_MEETING_ROOM,
	async (data) => {
		const results = await axios.put(
			`${baseURL}/room/${data.id}`,
			data.dataLockRoom,
		);
		return results.data;
	},
);

const getColorSelection = createAsyncThunk(
	ASYNC_ACTION.GET_COLOR_SELECTION,
	async () => {
		const results = await axios.get(`${baseURL}/calendar/color`);
		return results.data.content;
	},
);

const RoomManagementSlice = createSlice({
	name: "roomManagement",
	initialState,
	reducers: {
		setSortDirection: (state, action) => {
			state.sortDirection = action.payload;
		},
		setSortBy: (state, action) => {
			state.sortBy = action.payload;
		},
		setStatusOfRoom: (state, action) => {
			state.statusOfRoom = action.payload;
		},
		resetStatusOfDialog: (state, action) => {
			state.statusOfDialog = action.payload;
		},
		setColumns: (state, action) => {
			state.columns = action.payload;
		},
		setSearchListRoomsBooked: (state, action) => {
			state.searchListRoomsBooked = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			//CREATE_MEETING_ROOM
			.addCase(createMeetingRoom.pending, (state) => {
				state.statusOfDialog = "pending";
			})
			.addCase(createMeetingRoom.fulfilled, (state, action) => {
				toast.success("Create new room successfully !");
				state.statusOfDialog = "fulfilled";
				state.newRoom = action.payload;
			})
			.addCase(createMeetingRoom.rejected, (state, action) => {
				toast.error("Create new room error !");
				state.statusOfDialog = "rejected";
				state.error = action.error.message;
			})

			//GET ROOM LIST
			.addCase(getRoomList.pending, (state) => {
				state.status = true;
			})
			.addCase(getRoomList.fulfilled, (state, action) => {
				state.getRoomListStatus = "fulfilled";
				state.nonIdealStateStatus = false;
				state.roomsBooked = action.payload;
			})
			.addCase(getRoomList.rejected, (state, action) => {
				state.getRoomListStatus = "rejected";
				state.nonIdealStateStatus = true;
				state.error = action.error.message;
			})

			//UPDATE_ROOM_INFOR
			.addCase(updateRoomInfor.pending, (state) => {
				state.statusOfDialog = "pending";
			})
			.addCase(updateRoomInfor.fulfilled, (state, action) => {
				toast.success("Update room successfully !");
				state.statusOfDialog = "fulfilled";
				state.updateRoom = action.payload;
			})
			.addCase(updateRoomInfor.rejected, (state, action) => {
				toast.error("Update room error !");
				state.statusOfDialog = "rejected";
				state.error = action.error.message;
			})

			// DELETE_MEETING_ROOM
			.addCase(deleteMeetingRoom.pending, (state) => {
				state.statusOfDialog = "pending";
			})
			.addCase(deleteMeetingRoom.fulfilled, (state, action) => {
				toast.success("Delete room successfully !");
				state.statusOfDialog = "fulfilled";
				state.deleteRoom = action.payload;
			})
			.addCase(deleteMeetingRoom.rejected, (state, action) => {
				toast.error("Delete room error !");
				state.statusOfDialog = "rejected";
				state.error = action.error.message;
			})

			//LOCK_MEETING_ROOM
			.addCase(lockMeetingRoom.pending, (state) => {
				state.statusOfDialog = "pending";
			})
			.addCase(lockMeetingRoom.fulfilled, (state, action) => {
				toast.success(
					`${
						state.statusOfRoom === "Locked" ? "Lock" : "Unlock"
					} room successfully !`,
				);
				state.statusOfDialog = "fulfilled";
				state.lockRoom = action.payload;
			})
			.addCase(lockMeetingRoom.rejected, (state, action) => {
				toast.error("Lock room error !");
				state.statusOfDialog = "rejected";
				state.error = action.error.message;
			})

			//GET_COLOR_SELECTION
			.addCase(getColorSelection.pending, (state) => {
				state.status = true;
			})
			.addCase(getColorSelection.fulfilled, (state, action) => {
				state.status = false;
				state.colorSelection = action.payload;
			})
			.addCase(getColorSelection.rejected, (state, action) => {
				state.status = false;
				state.error = action.error.message;
			});
	},
});
export const {
	setSortDirection,
	setSortBy,
	setStatusOfRoom,
	resetStatusOfDialog,
	setColumns,
	setSearchListRoomsBooked,
} = RoomManagementSlice.actions;
export {
	createMeetingRoom,
	getRoomList,
	deleteMeetingRoom,
	lockMeetingRoom,
	updateRoomInfor,
	getColorSelection,
};
export default RoomManagementSlice.reducer;
