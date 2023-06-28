// @ts-nocheck
import axios from "axios";
import { createAsyncThunk } from "@reduxjs/toolkit";

const ASYNC_ACTION = {
	CREATE_SCHEDULE: "CREATE_SCHEDULE",
	UPDATE_SCHEDULE: "UPDATE_SCHEDULE",
	UPDATE_SCHEDULE_ON_DRAG: "UPDATE_SCHEDULE_ON_DRAG",
	DELETE_SCHEDULE: "DELETE_SCHEDULE",
	GET_SCHEDULE_LIST: "GET_SCHEDULE_LIST",
	GET_COLOR_LIST: "GET_COLOR_LIST",
};

const ScheduleListHandle = (schedules, colors) => {
	const ScheduleList = schedules.map((item) => {
		const room_id = item.extendedProperties?.private.room_id;
		const colorValue = colors[item.colorId];
		const finalStart = new Date(item.start["dateTime"]);
		const finalEnd = new Date(item.end["dateTime"]);
		return {
			...item,
			start: finalStart,
			end: finalEnd,
			calendarId: room_id,
			isAllDay: finalStart.getDay() != finalEnd.getDay(),
			backgroundColor: colorValue ? colorValue.background : "",
			borderColor: colorValue ? colorValue.foreground : "",
			color: "#000",
			title: item.summary,
		};
	});
	return ScheduleList;
};

const baseURL = "http://localhost:4001/api/calendar";

const getColorSelection = createAsyncThunk(
	ASYNC_ACTION.GET_COLOR_LIST,
	async () => {
		const result = await axios.get(`${baseURL}/color`);
		return result.data;
	},
);
const getScheduleList = createAsyncThunk(
	ASYNC_ACTION.GET_SCHEDULE_LIST,
	async () => {
		const token =
			"ya29.a0AWY7CklmamVC9I_PKhZx7NamFrrc9NKdOgR6NP1AA9XP-sr8SIGJwrPBQG4liG9jtmXykCmgGYVi00TFFOu4h_iEDS0XWFmElD-ldroRFvqJIljhy5K_4shOdg10bj7qrsgc3ufZv1FbYos3J5pEyHdIjkviaCgYKAZoSARESFQG1tDrpPac6kijcFpD9iURKef4MXQ0163";
		const timeMin = encodeURIComponent(getTime(0));
		const timeMax = encodeURIComponent(getTime(1));
		const config = {
			header: {
				Authorization: `Bearer ${token}`,
			},
		};
		const url = `${baseURL}/event?timeMin=${timeMin}&timeMax=${timeMax}&room_id=all`;
		// @ts-ignore
		const result = await axios.get(url, config);
		return result.data;
	},
);
const createSchedule = createAsyncThunk(
	ASYNC_ACTION.CREATE_SCHEDULE,
	async (payload) => {
		const result = await axios.post(`${baseURL}/event`, payload);
		return result.data;
	},
);
const updateScheduleInfo = createAsyncThunk(
	ASYNC_ACTION.UPDATE_SCHEDULE,
	async (payload) => {
		let url = `${baseURL}/event/${payload.id}`;
		const result = await axios.put(url, payload);
		return result.data;
	},
);
const updateScheduleOnDrag = createAsyncThunk(
	ASYNC_ACTION.UPDATE_SCHEDULE_ON_DRAG,
	async (event, changes) => {
		let payload;
		if (changes.start) {
			payload = {
				...event,
				summary: event.title,
				start: {
					dateTime: changes.start.toString(),
					timeZone: "Asia/Ho_Chi_Minh",
				},
				end: {
					dateTime: changes.end.toString(),
					timeZone: "Asia/Ho_Chi_Minh",
				},
				update_type: "single",
			};
		} else {
			payload = {
				...event,
				start: event.start,
				end: changes.end.toString(),
			};
		}
		let url = `${baseURL}/event/${payload.id}`;
		const result = await axios.put(url, payload);
		return result.data;
	},
);
const deleteSchedule = createAsyncThunk(
	ASYNC_ACTION.DELETE_SCHEDULE,
	async (payload) => {
		const token =
			"ya29.a0AWY7CklmamVC9I_PKhZx7NamFrrc9NKdOgR6NP1AA9XP-sr8SIGJwrPBQG4liG9jtmXykCmgGYVi00TFFOu4h_iEDS0XWFmElD-ldroRFvqJIljhy5K_4shOdg10bj7qrsgc3ufZv1FbYos3J5pEyHdIjkviaCgYKAZoSARESFQG1tDrpPac6kijcFpD9iURKef4MXQ0163";
		const config = {
			header: {
				Authorization: `Bearer ${token}`,
			},
		};
		const url = `${baseURL}/event/${payload.id}?delete_type=single`;
		const result = await axios.delete(url, config);
		return result.data;
	},
);
const getTime = (additional) => {
	const millisecond = 604800000;
	const aWeekBefore = new Date(Date.now() - millisecond);
	const month =
		aWeekBefore.getMonth() > 10
			? aWeekBefore.getMonth()
			: `0${aWeekBefore.getMonth()}`;
	const toDay =
		aWeekBefore.getDay() > 10
			? aWeekBefore.getDay()
			: `0${aWeekBefore.getDay()}`;
	let year;
	if (additional > 0) {
		year = aWeekBefore.getFullYear() + additional;
	} else {
		year = aWeekBefore.getFullYear();
	}
	return `${year}-${month}-${toDay}T00:00:00+07:00`;
};
export {
	createSchedule,
	updateScheduleInfo,
	deleteSchedule,
	getColorSelection,
	getScheduleList,
	ScheduleListHandle,
	updateScheduleOnDrag,
};
