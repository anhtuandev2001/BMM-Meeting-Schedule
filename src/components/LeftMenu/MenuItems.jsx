import IconMenuCalendar from "../../assets/icon/IconMenuCalendar";
import IconMenuRoom from "../../assets/icon/IconMenuRoom";
import IconMenuSetting from "../../assets/icon/IconMenuSetting";

const menuItems = [
	{
		to: "/room",
		icon: <IconMenuRoom />,
		title: "room-management",
	},
	{
		to: "/schedule",
		icon: <IconMenuCalendar />,
		title: "meeting-schedule",
	},
	{
		to: "/settings",
		icon: <IconMenuSetting />,
		title: "setting",
	},
];

export default menuItems;
