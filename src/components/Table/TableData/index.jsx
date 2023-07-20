/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import {
	Box,
	Button,
	Modal,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
	getColorSelection,
	getRoomList,
	resetStatusOfDialog,
	setSearchListRoomsBooked,
} from "../../../store/slices/roomManagementSlice";
import useAuth from "../../../utils/useAuth";
import ColumnsShowHide from "../ColumnsShowHide";
import ExportTable from "../ExportTable";
import MeetingRoomValidation from "../MeetingRoomValidation";
import NonIdealState from "../NonIdealState";
import TablePaginationRoomMeeting from "../Pagination";
import SkeletonLoading from "../SkeletonLoading";
import SortTable from "../SortTable";
import { getComparator, sortedRowInformation } from "../SortTable/sortData";
import TableAction from "../TableAction";
import {
	TableBodyCellStyle,
	TableHeadCellStyle,
	columnActionStyle,
} from "../TableStyle";
import TableSearch from "../TableSearch";
import { useTranslation } from "react-i18next";
function TableData() {
	const { t } = useTranslation();
	// process data when submitting form
	const dispatch = useDispatch();
	const { role } = useAuth();
	const {
		newRoom,
		roomsBooked,
		updateRoom,
		deleteRoom,
		lockRoom,
		colorSelection,
		sortBy,
		sortDirection,
		nonIdealStateStatus,
		status,
		columns,
		searchListRoomsBooked,
	} = useSelector((state) => state.roomManagement);

	//pagination table
	const pageSizeLocalStorage = parseInt(localStorage.getItem("pageSize"));
	const initialPageSize = !isNaN(pageSizeLocalStorage)
		? pageSizeLocalStorage
		: 10;
	const [pageNumber, setPageNumber] = useState(0);
	const [pageSize, setPageSize] = useState(initialPageSize);

	// get list room meeting from server
	useEffect(() => {
		dispatch(getColorSelection());
		dispatch(getRoomList());
	}, [dispatch, deleteRoom, newRoom, lockRoom, updateRoom]);
	useEffect(() => {
		dispatch(setSearchListRoomsBooked(roomsBooked));
	}, [roomsBooked]);
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
			<div>
				<div className="flex gap-2 text-[#6B778C]">
					<span>{t("calendar")}</span>
					<span>/</span>
					<span>{t("room")}</span>
				</div>
				<div className="table_infor_title mt-2 mb-1 flex justify-between">
					<h2 className="font-medium text-xl">{t("room-management")}</h2>
					<div className="flex">
						<Tooltip
							title={`${role !== "admin" ? t("admin-message-default") : ""}`}
							arrow={true}>
							<span>
								<Button
									disabled={!(role === "admin") || nonIdealStateStatus}
									aria-describedby="createNew"
									variant="contained"
									sx={{
										padding: 0.8,
									}}
									onClick={() => {
										dispatch(resetStatusOfDialog("idle"));
										onModalOpen(
											<MeetingRoomValidation
												value={null}
												message={"Create New Room"}
												action={"Create"}
												modalClose={onModalClose}
											/>,
										);
									}}
									disableRipple>
									{t("new-room")}
								</Button>
							</span>
						</Tooltip>
						<ExportTable />
					</div>
				</div>
			</div>
			<TableSearch />
			{nonIdealStateStatus ? (
				<NonIdealState />
			) : (
				<TableContainer sx={{ maxHeight: 430 }}>
					<Table
						sx={{ minWidth: 700 }}
						size="small"
						stickyHeader
						aria-label="sticky table">
						<TableHead>
							<TableRow className="relative">
								{columns.map(
									(column) =>
										column.showColumn && (
											<TableCell
												style={
													column.field === "action"
														? { ...columnActionStyle, zIndex: 6 }
														: {}
												}
												align="left"
												sx={TableHeadCellStyle}
												key={column.name}>
												{column.field === "action" ? (
													t(column.name.toLowerCase())
												) : (
													<SortTable column={column} />
												)}
											</TableCell>
										),
								)}
								<ColumnsShowHide />
							</TableRow>
						</TableHead>
						<TableBody sx={{ borderBottomWidth: 2, borderColor: "#ddd" }}>
							{searchListRoomsBooked.length > 0 &&
								sortedRowInformation(
									searchListRoomsBooked,
									getComparator(sortDirection, sortBy),
								)
									.slice(
										pageNumber * pageSize,
										pageNumber * pageSize + pageSize,
									)
									.map((row, idx) => (
										<TableRow key={idx}>
											{columns.map(
												(col, idx) =>
													col.showColumn && (
														<TableCell
															style={
																col.field === "action"
																	? { ...columnActionStyle, zIndex: 5 }
																	: {}
															}
															key={idx}
															sx={
																col.field === "action"
																	? { ...TableBodyCellStyle, maxWidth: 160 }
																	: TableBodyCellStyle
															}>
															{status ? (
																<SkeletonLoading />
															) : (
																<>
																	{col.field === "action" ? (
																		<TableAction
																			className="sticky left-0"
																			row={row}
																			onModalClose={onModalClose}
																			onModalOpen={onModalOpen}
																		/>
																	) : (
																		<>
																			{col.field === "colorId" ||
																			col.field === "status" ? (
																				<Tooltip
																					placement="bottom-start"
																					title={
																						(col.renderCell
																							? col.renderCell(
																									colorSelection[
																										row[col.field]
																									] || row[col.field],
																							  )
																							: row[col.field]) && (
																							<span
																								style={{
																									fontFamily:
																										"Nunito, sans-serif",
																								}}>
																								{colorSelection[row[col.field]]
																									?.background ||
																									row[col.field]}
																							</span>
																						)
																					}
																					arrow>
																					<span>
																						{(col.renderCell
																							? col.renderCell(
																									colorSelection[
																										row[col.field]
																									] || row[col.field],
																							  )
																							: row[col.field]) || "-"}
																					</span>
																				</Tooltip>
																			) : (
																				<Tooltip
																					title={
																						(col.renderCell
																							? col.renderCell(row[col.field])
																							: row[col.field]) && (
																							<span
																								style={{
																									fontFamily:
																										"Nunito, sans-serif",
																								}}>
																								{col.renderCell
																									? col.renderCell(
																											row[col.field],
																									  )
																									: row[col.field]}
																							</span>
																						)
																					}
																					arrow>
																					<span className="w-full inline-block text-ellipsis truncate">
																						{(col.renderCell
																							? col.renderCell(row[col.field])
																							: row[col.field]) || "-"}
																					</span>
																				</Tooltip>
																			)}
																		</>
																	)}
																</>
															)}
														</TableCell>
													),
											)}
										</TableRow>
									))}
						</TableBody>
					</Table>
				</TableContainer>
			)}
			{!nonIdealStateStatus && (
				<TablePaginationRoomMeeting
					roomsBooked={searchListRoomsBooked}
					pageNumber={pageNumber}
					setPageNumber={setPageNumber}
					pageSize={pageSize}
					setPageSize={setPageSize}
				/>
			)}
			{/* // add modals and add meeting form  */}
			<Modal id="createNew" open={isModalShow} onClose={onModalClose}>
				<Box className="absolute top-[50%] left-[50%] translate-x-[-50%] h-[95%] translate-y-[-50%]  w-[100%] md:w-[50%] lg:w-[45%] xl:w-[30%]">
					{modalChild}
				</Box>
			</Modal>
		</div>
	);
}
export default TableData;
