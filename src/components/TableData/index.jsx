/* eslint-disable no-unused-vars */
// @ts-nocheck
import { Box, Button, Modal, Tooltip } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";
import { BsThreeDots } from "react-icons/bs";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	getColorSelection,
	getRoomList,
} from "../../store/slices/roomManagementSlice";
import TableAction from "../TableAction";
import NonIdealState from "../NonIdealState";
import TablePaginationRoomMeeting from "../Pagination";
import SkeletonLoading from "../SkeletonLoading";
import SortTable, { getComparator, sortedRowInformation } from "../SortTable";
import MeetingRoomValidation from "../meetingRoomValidation";

function TableData() {
	// process data when submitting form
	const dispatch = useDispatch();
	const {
		newRoom,
		roomsbooked,
		updateRoom,
		deleteRoom,
		lockRoom,
		colorSelection,
		sortBy,
		sortDirection,
		nonIdealStateStatus,
		status,
	} = useSelector((state) => state.roomManagement);
	//information of columns

	const columns = [
		{
			field: "id",
			name: "ID",
			showColumn: true,
		},
		{
			field: "name",
			name: "Name",
			showColumn: true,
		},
		{
			field: "location",
			name: "Location",
			showColumn: true,
		},
		{
			field: "devices",
			name: "Devices",
			showColumn: true,
			renderCell: (val) => <span> {val && val.join(", ")} </span>,
		},
		{
			field: "description",
			name: "Description",
			showColumn: true,
		},
		{
			field: "capacity",
			name: "Capacity",
			showColumn: true,
		},
		{
			field: "colorId",
			name: "Color",
			showColumn: true,
			renderCell: (val) => (
				<span
					style={{
						color: `${colorSelection[val] && colorSelection[val].background}`,
					}}>
					{colorSelection[val] && colorSelection[val].background}
				</span>
			),
		},
		{
			field: "status",
			name: "Status",
			showColumn: true,
			renderCell: (val) => (
				<span style={{ color: val === "Locked" ? "red" : "" }}>{val}</span>
			),
		},
		{
			field: "action",
			name: "Action",
			showColumn: true,
		},
	];

	//pagination table
	const pageSizeLocalStorage = parseInt(localStorage.getItem("pageSize"));
	const initialPageSize = !isNaN(pageSizeLocalStorage)
		? pageSizeLocalStorage
		: 5;
	const [pageNumber, setPageNumber] = useState(0);
	const [pageSize, setPageSize] = useState(initialPageSize);

	// end table sort
	const TableHeadCellStyle = {
		fontSize: "12",
		padding: "10px 16px",
		fontWeight: "400",
		fontFamily: "Nunito, sans-serif",
		color: "#6B778C",
		borderBottom: "2px solid #dfe1e6",
	};

	const TableBodyCellStyle = {
		fontSize: "14",
		padding: "10px 16px",
		fontWeight: "400",
		fontFamily: "Nunito, sans-serif",
		color: "#172B4D",
		borderBottom: "0",
		whiteSpace: "nowrap",
		overflow: "hidden",
		textOverflow: "ellipsis",
		maxWidth: 160,
		transition: "all .05s linear",
	};
	// get list room meeting from server

	useEffect(() => {
		dispatch(getColorSelection());
		dispatch(getRoomList());
	}, [dispatch, deleteRoom, newRoom, lockRoom, updateRoom]);

	const [isModalShow, setIsModalShow] = useState(false);

	const [modalChild, setModalChild] = useState(null);
	const onModalOpen = (modalChild) => {
		setModalChild(modalChild);
		setIsModalShow(true);
	};
	const onModalClose = () => {
		setIsModalShow(false);
	};
	return (
		<div className="pl-4 pr-3 pt-4">
			<div className="">
				<div className="flex gap-2 text-[#6B778C]">
					<Link to="/">Calendar</Link>
					<span>/</span>
					<Link to="/schedule">Room</Link>
				</div>
				<div className="table_infor_title my-[10px] flex justify-between">
					<h2 className="font-medium text-xl">Room management</h2>
					<div className="flex">
						<Button
							aria-describedby="createNew"
							className="p-0"
							sx={{
								padding: 0,
							}}
							onClick={() =>
								!nonIdealStateStatus &&
								onModalOpen(
									<MeetingRoomValidation
										value={null}
										message={"Create Cali Room"}
										action={"Create"}
										modalClose={onModalClose}
									/>,
								)
							}
							disableRipple>
							<div className="rounded bg-blue-500 text-white py-1.5 px-3 hover:bg-blue-400">
								New Room
							</div>
						</Button>
						<button className="px-2 ml-4 text-2xl bg-gray-100 rounded">
							<BsThreeDots />
						</button>
					</div>
				</div>
			</div>
			{nonIdealStateStatus ? (
				<NonIdealState />
			) : (
				<TableContainer sx={{ maxHeight: 440 }}>
					<Table
						sx={{ minWidth: 700 }}
						size="small"
						stickyHeader
						aria-label="sticky table">
						<TableHead>
							<TableRow>
								{columns.map((column) => (
									<TableCell
										align="left"
										sx={TableHeadCellStyle}
										key={column.name}>
										{column.field === "action" ? (
											column.name
										) : (
											<SortTable column={column} />
										)}
									</TableCell>
								))}
							</TableRow>
						</TableHead>
						<TableBody sx={{ borderBottomWidth: 2, borderColor: "#ddd" }}>
							{roomsbooked.length &&
								sortedRowInformation(
									roomsbooked,
									getComparator(sortDirection, sortBy),
								)
									.slice(
										pageNumber * pageSize,
										pageNumber * pageSize + pageSize,
									)
									.map((row, idx) => (
										<TableRow key={idx}>
											{columns.map((col, idx) => (
												<TableCell key={idx} sx={TableBodyCellStyle}>
													{status ? (
														<SkeletonLoading />
													) : (
														<>
															{col.field === "action" ? (
																<TableAction
																	row={row}
																	onModalClose={onModalClose}
																	onModalOpen={onModalOpen}
																/>
															) : (
																<>
																	{col.field === "colorId" ||
																	col.field === "status" ? (
																		<Tooltip
																			title={
																				<span
																					style={{
																						fontFamily: "Nunito, sans-serif",
																					}}>
																					{colorSelection[row[col.field]]
																						?.background || row[col.field]}
																				</span>
																			}
																			arrow>
																			<span>
																				{col.renderCell
																					? col.renderCell(row[col.field])
																					: row[col.field] || "-"}
																			</span>
																		</Tooltip>
																	) : (
																		<Tooltip
																			title={
																				<span
																					style={{
																						fontFamily: "Nunito, sans-serif",
																					}}>
																					{col.renderCell
																						? col.renderCell(row[col.field])
																						: row[col.field] || "-"}
																				</span>
																			}
																			arrow>
																			<span>
																				{col.renderCell
																					? col.renderCell(row[col.field])
																					: row[col.field] || "-"}
																			</span>
																		</Tooltip>
																	)}
																</>
															)}
														</>
													)}
												</TableCell>
											))}
										</TableRow>
									))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{!nonIdealStateStatus && (
				<TablePaginationRoomMeeting
					roomsbooked={roomsbooked}
					pageNumber={pageNumber}
					setPageNumber={setPageNumber}
					pageSize={pageSize}
					setPageSize={setPageSize}
				/>
			)}
			{/* // add modals and add meeting form  */}
			<Modal id="createNew" open={isModalShow} onClose={onModalClose}>
				<Box className="absolute top-[15%] left-[50%] translate-x-[-50%]  w-[100%] md:w-[50%] lg:w-[45%] xl:w-[30%]">
					{modalChild}
				</Box>
			</Modal>
		</div>
	);
}

export default TableData;
