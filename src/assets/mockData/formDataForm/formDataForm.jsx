/* eslint-disable react-refresh/only-export-components */

// const meetingForm = {
// 	value: {
// 		roomName: "test room",
// 		description: "lorem 123",
// 		capacity: "123",
// 		devices: [],
// 		colorId: "blue",
// 	},
// 	title: "Edit Cali Room",
// 	action: "update",
// };

// const alertForm = {
// 	action: "Lock", // "delete"
// 	payload: {}, // data sent,
// 	// onModalClose : //modalClose()  // this is a setSTate function to close modale
// };

const checkboxValues = [
	{
		name: "devices",
		value: "Projecter",
	},
	{
		name: "devices",
		value: "TV 65 inch",
	},
	{
		name: "devices",
		value: "TV 75 inch",
	},
	{
		name: "devices",
		value: "TV 40 inch",
	},
];

const InitColorSelection = {
	1: {
		background: "",
		foreground: "",
	},
};
const formValidation = [
	{
		name: "name",
		label: "Room Name",
	},
	{
		name: "location",
		label: "Location",
	},
];
export { checkboxValues, InitColorSelection, formValidation };
