import { isEmpty, isNil } from "lodash";

export const InitialColumns = [
	{
		field: "id",
		name: "ID",
		showColumn: true,
	},
	{
		field: "name",
		name: "name",
		showColumn: true,
	},
	{
		field: "location",
		name: "location",
		showColumn: true,
	},
	{
		field: "devices",
		name: "devices",
		showColumn: true,
		renderCell: (val) =>
			!isEmpty(val) ? <span> {val && val.join(", ")} </span> : "",
	},
	{
		field: "description",
		name: "description",
		showColumn: true,
	},
	{
		field: "capacity",
		name: "capacity",
		showColumn: true,
	},
	{
		field: "colorId",
		name: "color",
		showColumn: true,
		renderCell: (val) =>
			val?.background ? (
				<span
					style={{
						color: `${val?.background}`,
					}}>
					{val?.background}
				</span>
			) : (
				""
			),
	},
	{
		field: "status",
		name: "status",
		showColumn: true,
		renderCell: (val) =>
			val ? (
				<span style={{ color: val === "Locked" ? "red" : "" }}>{val}</span>
			) : (
				""
			),
	},
	{
		field: "action",
		name: "action",
		showColumn: true,
	},
];
//get columns in localStorage
const userColumn = JSON.parse(localStorage.getItem("userColumns"));
export const ConfigColumns =
	!isNil(userColumn) &&
	InitialColumns.map((initialColumn, index) => {
		return { ...initialColumn, ...userColumn[index] };
	});
