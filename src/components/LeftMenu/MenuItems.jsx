import IconMenuCalendar from "../../assets/icon/IconMenuCalendar";
import IconMenuRoom from "../../assets/icon/IconMenuRoom";
import IconMenuSetting from "../../assets/icon/IconMenuSetting";

const menuItems = [
	{
		to: "/room",
		icon: <IconMenuRoom />,
		title: "Room management",
	},
	{
		to: "/schedule",
		icon: <IconMenuCalendar />,
		title: "Meeting Schedule",
	},
	{
		to: "/settings",
		icon: <IconMenuSetting />,
		title: "Setting",
	},
];

export default menuItems;
