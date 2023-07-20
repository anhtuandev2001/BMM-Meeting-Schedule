// @ts-nocheck
import * as React from "react";
import Button from "@mui/material/Button";
import { Menu, MenuItem } from "@mui/material";
import { BsThreeDots } from "react-icons/bs";
import { useSelector } from "react-redux";
import { getComparator, sortedRowInformation } from "../SortTable/sortData";
import { FaDownload } from "react-icons/fa";
import * as XLSX from "xlsx";
import { useTranslation } from "react-i18next";
export default function ExportTable() {
	const { t } = useTranslation();
	const { roomsBooked, columns, colorSelection } = useSelector(
		(state) => state.roomManagement,
	);
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleExportFile = (value) => {
		const tableData = [];
		const headerTableData = columns?.map((column) =>
			column?.field === "action" ? "" : column?.name,
		);
		tableData.push(headerTableData.filter((str) => Boolean(str)));
		sortedRowInformation(roomsBooked, getComparator("asc", "id")).map(
			(roomInfor) => {
				const tableDataRow = columns.map((column) => {
					if (column.field === "colorId") {
						return colorSelection[roomInfor[column.field]]?.background || "-";
					} else if (column.field === "devices") {
						return roomInfor[column.field].join("_") || "-";
					} else if (column.field === "action") {
						return "";
					} else {
						return roomInfor[column.field] || "-";
					}
				});
				return tableData.push(tableDataRow.filter((str) => Boolean(str)));
			},
		);
		//export file by sheetJS library
		const workSheet = XLSX.utils.aoa_to_sheet(tableData);
		const workBook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workBook, workSheet, "SheetJS1");
		XLSX.writeFile(workBook, value);
		// close popper
		setAnchorEl(null);
	};
	const handleListItemClick = (value) => {
		handleExportFile(value);
	};
	const exportOptionStyle = {
		fontFamily: "Nunito, sans-serif",
		padding: "2px 6px",
		margin: "2px 6px",
		borderRadius: "6px",
		"&:hover": { background: "#ddd" },
		fontSize: "16px",
	};

	return (
		<div>
			<Button
				id="basic-button"
				aria-controls={open ? "basic-menu" : undefined}
				aria-haspopup="true"
				aria-expanded={open ? "true" : undefined}
				onClick={handleClick}
				sx={{ all: "initial" }}
				disableRipple>
				<div className="p-2 ml-4 text-2xl bg-gray-100 hover:bg-gray-200 rounded-md">
					<BsThreeDots />
				</div>
			</Button>
			<Menu
				sx={{ padding: "4px 2px" }}
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}>
				<MenuItem
					aria-haspopup="true"
					aria-expanded="true"
					id="export-option"
					onClick={() => handleListItemClick("meetingRoom.csv")}
					sx={exportOptionStyle}>
					<span className="text-sm">
						{" "}
						<FaDownload />{" "}
					</span>
					<span className="ml-2">{t("export")} .CSV</span>
				</MenuItem>
				<MenuItem
					aria-haspopup="true"
					aria-expanded="true"
					id="export-option"
					onClick={() => handleListItemClick("meetingRoom.xlsx")}
					sx={exportOptionStyle}>
					<span className="text-sm">
						{" "}
						<FaDownload />{" "}
					</span>
					<span className="ml-2">{t("export")} .XLSX</span>
				</MenuItem>
			</Menu>
		</div>
	);
}
