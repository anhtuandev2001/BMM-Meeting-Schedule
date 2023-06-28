import { createSelector } from "reselect";

export const filterRoomSelector = (state) => state.filtersCalendar?.room;
export const filterMeetingSelector = (state) => state.filtersCalendar?.meeting;
export const scheduleListSelector = (state) =>
	state.scheduleManagement?.FinalScheduleList;

export const scheduleListRemainingSelector = createSelector(
	filterMeetingSelector,
	filterRoomSelector,
	scheduleListSelector,
	(filterMeeting = 7, filterRoom = 0, scheduleList = []) => {
		if (filterMeeting == 7 && filterRoom == 0) {
			return scheduleList;
		}
		return scheduleList.filter((item) => {
			const startDateTime = new Date(item.start);
			const endDateTime = new Date(item.end);
			const dayStartOfWeek = startDateTime.getDay();
			const dayEndOfWeek = endDateTime.getDay();
			const range = Array.from(
				{ length: Math.abs(dayEndOfWeek - dayStartOfWeek) + 1 },
				(_, index) =>
					dayStartOfWeek > dayEndOfWeek
						? dayStartOfWeek - index
						: dayStartOfWeek + index,
			);
			console.log(item.extendedProperties.private.room_id, filterRoom);
			return (
				(filterMeeting !== 7 &&
					filterRoom === 0 &&
					range.includes(filterMeeting)) ||
				(filterRoom !== 0 &&
					filterMeeting == 7 &&
					item.extendedProperties.private.room_id == filterRoom) ||
				(item.extendedProperties.private.room_id == filterRoom &&
					range.includes(filterMeeting))
			);
		});
	},
);
