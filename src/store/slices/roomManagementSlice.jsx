// @ts-nocheck
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { FakeTableData } from "../../assets/mockData/TableData/FakeTableData";
const initialState = {
	newRoom: {},
	roomsbooked: FakeTableData,
	updateRoom: {},
	deleteRoom: {},
	lockRoom: {},
	colorSelection: {},
	sortDirection: "asc",
	sortBy: "id",
	status: false,
	nonIdealStateStatus: false,
	statusOfRoom: "",
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

const updateRoomInfo = createAsyncThunk(
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
	},
	extraReducers: (builder) => {
		builder
			//CREATE_MEETING_ROOM
			.addCase(createMeetingRoom.fulfilled, (state, action) => {
				toast.success("Create new room success !");
				state.newRoom = action.payload;
			})
			.addCase(createMeetingRoom.rejected, (state, action) => {
				toast.error("Create new room error !");
				state.error = action.error.message;
			})

			//GET ROOM LIST
			.addCase(getRoomList.pending, (state) => {
				state.status = true;
			})
			.addCase(getRoomList.fulfilled, (state, action) => {
				state.nonIdealStateStatus = false;
				// state.status = false;
				state.roomsbooked = action.payload;
			})
			.addCase(getRoomList.rejected, (state, action) => {
				state.nonIdealStateStatus = true;
				// state.status = false;
				state.error = action.error.message;
			})

			//UPDATE_ROOM_INFOR
			.addCase(updateRoomInfo.fulfilled, (state, action) => {
				toast.success("Update room successfully !");
				state.updateRoom = action.payload;
			})
			.addCase(updateRoomInfo.rejected, (state, action) => {
				toast.error("Update room error !");
				state.error = action.error.message;
			})

			// DELETE_MEETING_ROOM
			.addCase(deleteMeetingRoom.fulfilled, (state, action) => {
				toast.success("Delete room successfully !");
				state.deleteRoom = action.payload;
			})
			.addCase(deleteMeetingRoom.rejected, (state, action) => {
				toast.error("Delete room error !");
				state.error = action.error.message;
			})

			//LOCK_MEETING_ROOM

			.addCase(lockMeetingRoom.fulfilled, (state, action) => {
				toast.success(
					`${
						state.statusOfRoom === "Locked" ? "Lock" : "Unlock"
					} room successfully !`,
				);
				state.lockRoom = action.payload;
			})
			.addCase(lockMeetingRoom.rejected, (state, action) => {
				toast.error("Lock room error !");
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
export const { setSortDirection, setSortBy, setStatusOfRoom } =
	RoomManagementSlice.actions;
export {
	createMeetingRoom,
	deleteMeetingRoom,
	getColorSelection,
	getRoomList,
	lockMeetingRoom,
	updateRoomInfo,
};
export default RoomManagementSlice.reducer;
