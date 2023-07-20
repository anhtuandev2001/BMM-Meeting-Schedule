import { createSelector } from "reselect";

export const filterRoomSelector = (state) => state.filtersCalendar?.room;
export const filterMeetingSelector = (state) => state.filtersCalendar?.meeting;
export const filterCheckboxSelector = (state) => state.filtersCalendar?.checked;
export const userSelector = (state) => state.user?.email;
export const scheduleListSelector = (state) =>
	state.scheduleManagement?.FinalScheduleList;

export const scheduleListRemainingSelector = createSelector(
	filterMeetingSelector,
	filterRoomSelector,
	filterCheckboxSelector,
	userSelector,
	scheduleListSelector,
	(
		filterMeeting = 7,
		filterRoom = 0,
		checked = false,
		email = "",
		scheduleList = [],
	) => {
		if (filterMeeting == 7 && filterRoom == 0 && !checked) {
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
			const { attendees = [] } = item;
			const isEmail = attendees.some((item) => {
				return item.email == email;
			});
			if (filterMeeting == 7 && filterRoom == 0 && checked) {
				return isEmail;
			}
			return checked
				? (isEmail &&
						filterMeeting != 7 &&
						filterRoom == 0 &&
						range.includes(filterMeeting)) ||
						(filterRoom != 0 &&
							filterMeeting == 7 &&
							item?.extendedProperties?.private?.room_id == filterRoom) ||
						(item?.extendedProperties?.private?.room_id == filterRoom &&
							range.includes(filterMeeting))
				: (filterMeeting != 7 &&
						filterRoom == 0 &&
						range.includes(filterMeeting)) ||
						(filterRoom != 0 &&
							filterMeeting == 7 &&
							item?.extendedProperties?.private?.room_id == filterRoom) ||
						(item?.extendedProperties?.private?.room_id == filterRoom &&
							range.includes(filterMeeting));
		});
	},
);
