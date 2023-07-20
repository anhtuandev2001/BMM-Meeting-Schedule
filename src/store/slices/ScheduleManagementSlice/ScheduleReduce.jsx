/* eslint-disable react-refresh/only-export-components */
// @ts-nocheck
import axios from "axios";
import { DateTime } from "luxon";
import { createAsyncThunk } from "@reduxjs/toolkit";
const token =
	"ya29.a0AWY7CklmamVC9I_PKhZx7NamFrrc9NKdOgR6NP1AA9XP-sr8SIGJwrPBQG4liG9jtmXykCmgGYVi00TFFOu4h_iEDS0XWFmElD-ldroRFvqJIljhy5K_4shOdg10bj7qrsgc3ufZv1FbYos3J5pEyHdIjkviaCgYKAZoSARESFQG1tDrpPac6kijcFpD9iURKef4MXQ0163";
const baseURL = "http://localhost:4001/api/calendar";

const ASYNC_ACTION = {
	CREATE_SCHEDULE: "CREATE_SCHEDULE",
	UPDATE_SCHEDULE: "UPDATE_SCHEDULE",
	UPDATE_SCHEDULE_ON_DRAG: "UPDATE_SCHEDULE_ON_DRAG",
	DELETE_SCHEDULE: "DELETE_SCHEDULE",
	GET_SCHEDULE_LIST: "GET_SCHEDULE_LIST",
	GET_COLOR_LIST: "GET_COLOR_LIST",
	GET_ONE_SCHEDULE: "GET_ONE_SCHEDULE",
};

const ScheduleListHandle = (schedules, colors) => {
	const ScheduleList = schedules.map((item) => {
		const room_id = item.extendedProperties?.private.room_id;
		const colorValue = colors[item.colorId];
		const finalStart = item.start.dateTime;
		const finalEnd = item.end.dateTime;
		return {
			...item,
			start: finalStart,
			end: finalEnd,
			calendarId: room_id,
			isAllday:
				Number(finalStart.slice(8, 10)) != Number(finalEnd.slice(8, 10)),
			backgroundColor: colorValue ? colorValue.background : "",
			borderColor: colorValue ? colorValue.foreground : "",
			color: "#000",
			title: item.summary,
		};
	});
	return ScheduleList;
};

const getSchedule = createAsyncThunk(
	ASYNC_ACTION.GET_ONE_SCHEDULE,
	async (id) => {
		const result = await axios.get(`${baseURL}/schedule/${id}`);
		return result.data;
	},
);

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
	async (data) => {
		const config = {
			method: `put`,
			url: `${baseURL}/event/${data.id}`,
			header: {
				Authorization: `Bearer ${token}`,
			},
			data: data.payload,
		};
		const result = await axios(config);
		return result.data;
	},
);

const updateScheduleOnDrag = createAsyncThunk(
	ASYNC_ACTION.UPDATE_SCHEDULE_ON_DRAG,
	async ({ changes, event }) => {
		let payload;
		if (changes.start) {
			payload = {
				recurrence: ["RRULE:FREQ=MONTHLY;COUNT=1"],
				summary: event.title,
				start: {
					dateTime: DateTime.fromJSDate(new Date(changes.start))
						.toString()
						.slice(0, 16),
					timeZone: "UTC",
				},
				end: {
					dateTime: DateTime.fromJSDate(new Date(changes.end))
						.toString()
						.slice(0, 16),
					timeZone: "UTC",
				},
				is_remove_meet: true,
				update_type: "single",
			};
		} else {
			payload = {
				summary: event.title,
				recurrence: ["RRULE:FREQ=MONTHLY;COUNT=1"],
				start: {
					dateTime: DateTime.fromJSDate(new Date(event.start))
						.toString()
						.slice(0, 16),
					timeZone: "UTC",
				},
				end: {
					dateTime: DateTime.fromJSDate(new Date(changes.end))
						.toString()
						.slice(0, 16),
					timeZone: "UTC",
				},
				extendedProperties: {
					room_id: event.calendarId,
				},
				is_remove_meet: true,
				update_type: "single",
			};
		}
		const config = {
			method: `put`,
			header: {
				Authorization: `Bearer ${token}`,
			},
			url: `${baseURL}/event/${event.id}`,
			data: payload,
		};
		const result = await axios(config);
		return result.data;
	},
);

const deleteSchedule = createAsyncThunk(
	ASYNC_ACTION.DELETE_SCHEDULE,
	async (payload) => {
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
	getSchedule,
};
