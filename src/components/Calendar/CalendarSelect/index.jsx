// @ts-nocheck
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import {
	roomFilterChange,
	viewFilterChange,
	meetingFilterChange,
} from "../../../store/slices/ScheduleManagementSlice/filterCalendarSlice";

function CalendarSelect({ list = [], typeSelect = "view" }) {
	const {
		room = 0,
		meeting = 7,
		view = "week",
	} = useSelector((state) => state.filtersCalendar);
	const dispatch = useDispatch();
	const [selectedValue, setSelectedValue] = useState(() => {
		switch (typeSelect) {
			case "view":
				return localStorage.getItem("view") || "week";
			case "room":
				return room;
			case "meeting":
				return meeting;
			default:
				return localStorage.getItem("view") || "week";
		}
	});

	useEffect(() => {
		if (typeSelect == "meeting" && view == "day") {
			setSelectedValue(7);
			dispatch(meetingFilterChange(7));
		}
	}, [view]);

	const handleChange = (event) => {
		const { value } = event.target;
		setSelectedValue(value);
		switch (typeSelect) {
			case "view":
				dispatch(viewFilterChange(value));
				localStorage.setItem("view", value);
				break;
			case "room":
				dispatch(roomFilterChange(value));
				break;
			case "meeting":
				dispatch(meetingFilterChange(value));
				break;
			default:
				break;
		}
	};

	return (
		<FormControl
			sx={{
				"& .MuiSelect-select": {
					backgroundColor: "#F4F5F7",
					color: "#7A869A",
					padding: "6px 8px",
					fontFamily: "Nunito",
					border: "none",
				},
				"& .MuiOutlinedInput-notchedOutline": {
					border: "none",
				},
			}}>
			<Select
				value={selectedValue}
				onChange={handleChange}
				displayEmpty
				sx={{
					border: "none",
					textTransform: "capitalize",
				}}>
				{typeSelect === "room" && (
					<MenuItem
						value={0}
						sx={{ fontFamily: "Nunito", color: "#7a869a", border: "none" }}>
						All Room
					</MenuItem>
				)}
				{list.map((item) => (
					<MenuItem
						key={uuidv4()}
						value={typeSelect === "view" ? item?.name : item?.id}
						sx={{
							fontFamily: "Nunito",
							color: "#7a869a",
							border: "none",
							textTransform: "capitalize",
						}}>
						{item?.name}
					</MenuItem>
				))}
			</Select>
		</FormControl>
	);
}

export default CalendarSelect;
