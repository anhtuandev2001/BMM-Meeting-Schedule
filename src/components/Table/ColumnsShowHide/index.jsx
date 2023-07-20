// @ts-nocheck
import { TableCell } from "@mui/material";
import Button from "@mui/material/Button";
import Popover from "@mui/material/Popover";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import { BsGear } from "react-icons/bs";
import { TfiClose } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { setColumns } from "../../../store/slices/roomManagementSlice";
import { cloneDeep } from "lodash";
import { useTranslation } from "react-i18next";
function ColumnsShowHide() {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { columns } = useSelector((state) => state.roomManagement);
	const handleColumnShowHideToggle = (index) => {
		const newColumns = cloneDeep(columns);
		newColumns[index].showColumn = !newColumns[index].showColumn;
		dispatch(setColumns(newColumns));
	};
	//save columns in localStorage
	localStorage.setItem("userColumns", JSON.stringify(columns));

	//pop up
	const [anchorEl, setAnchorEl] = useState(null);

	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const open = Boolean(anchorEl);
	const id = open ? "simple-popover" : undefined;
	return (
		<>
			<TableCell
				style={{ position: "sticky", right: 0 }}
				sx={{
					borderBottom: "2px solid #dfe1e6",
					padding: "10px 6px 10px 0px",
					zIndex: 15,
					width: 30,
				}}>
				<Button
					disableRipple
					aria-describedby={id}
					onClick={handleClick}
					sx={{ all: "initial" }}>
					<div className="cursor-pointer p-1 hover:bg-gray-200 rounded-lg sticky right-0">
						<BsGear />
					</div>
				</Button>
			</TableCell>
			<Popover
				id={id}
				open={open}
				anchorEl={anchorEl}
				onClose={handleClose}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "right",
				}}
				transformOrigin={{
					vertical: "top",
					horizontal: "right",
				}}
				sx={{ p: 2, m: 2, minWidth: 30 }}>
				<Typography sx={{ p: 2, minWidth: 180 }}>
					<span>
						<button
							onClick={handleClose}
							className="float-right hover:bg-slate-200 px-2 py-2 rounded-lg">
							<TfiClose />
						</button>
						<span className="clear-right">
							{columns.map(
								(column, index) =>
									!(column.field === "id" || column.field === "action") && (
										<li key={column.name} className="list-none">
											<Switch
												checked={column.showColumn}
												onChange={() => handleColumnShowHideToggle(index)}
												name="showColumn"
											/>
											{t(column.name.toLowerCase())}
										</li>
									),
							)}
						</span>
					</span>
				</Typography>
			</Popover>
		</>
	);
}
export default ColumnsShowHide;
