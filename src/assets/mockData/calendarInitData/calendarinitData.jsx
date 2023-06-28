const initialEvents = [
	{
		id: "1r1j6dbqkaimpqlqkbs7b9q1co",
		calendarId: "cal1",
		title: "Lunch",
		category: "time",
		start: "Sun Jun 11 2023 12:00:00 GMT+0700 (Giờ Đông Dương)",
		end: " Sun Jun 11 2023 14:00:00 GMT+0700 (Giờ Đông Dương)",
	},
	{
		id: "2",
		calendarId: "cal1",
		title: "Coffee Break",
		category: "time",
		start: "Sun Jun 11 2023 09:00:00 GMT+0700 (Giờ Đông Dương)",
		end: " Sun Jun 11 2023 12:00:00 GMT+0700 (Giờ Đông Dương)",
	},
];

const calendarOptions = [
	{
		id: "1",
		name: "My Calendar",
	},
	{
		id: "2",
		name: "Company",
	},
];
const initialScheduleFormData = {
	title: "",
	room: "",
	start: "",
	end: "",
};

export { initialEvents, calendarOptions, initialScheduleFormData };
