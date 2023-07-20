// @ts-nocheck
import { IconButton, Modal, Tooltip } from "@mui/material";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BsCalendarEvent, BsFillHouseDoorFill } from "react-icons/bs";
import { FiEdit2, FiUsers } from "react-icons/fi";
import { GrClose } from "react-icons/gr";
import { LiaMapMarkerAltSolid } from "react-icons/lia";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import { RiDeleteBin6Line } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { deleteSchedule } from "../../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import CalendarScheduleForm from "../CalendarScheduleForm";
function ScheduleInfoPopup({ payload, onCloseModal }) {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { status } = useSelector((state) => state.scheduleManagement);
	const [modalChild, setModalChild] = useState(false);
	const [openChild, setOpenChild] = useState(false);
	const { FinalScheduleList } = useSelector(
		(state) => state?.scheduleManagement,
	);
	const openModalChild = (child) => {
		setOpenChild(true);
		setModalChild(child);
	};
	const onCloseModalChild = () => {
		setOpenChild(false);
		onCloseModal();
	};
	const removeEvent = () => {
		handleOpen();
		dispatch(deleteSchedule(payload));
	};
	useEffect(() => {
		if (status.deleteSchedule === "success") {
			handleClose();
			onCloseModal();
		}
		if (status.deleteSchedule === "error") {
			handleClose();
		}
	}, [status.deleteSchedule]);

	const { roomsBooked } = useSelector((state) => state.roomManagement);
	const room = roomsBooked?.find((room) => room.id == payload?.calendarId);
	const roomName = room ? room.name : "No name";
	const { attendees = [] } = payload;
	const creator = attendees.slice(-1)[0]?.email;

	const startDateString = payload.start.d;
	const startDateObj = new Date(startDateString);

	const endDateString = payload.end.d;
	const endDateObj = new Date(endDateString);

	const startOptions = {
		weekday: "long",
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};

	const formattedStartDate = startDateObj.toLocaleString("en-US", startOptions);

	const endOptions = {
		month: "long",
		day: "numeric",
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	};

	let formattedEndDate;
	if (startDateObj.getDate() === endDateObj.getDate()) {
		formattedEndDate = endDateObj.toLocaleString("en-US", {
			hour: "numeric",
			minute: "numeric",
			hour12: true,
		});
	} else {
		formattedEndDate = endDateObj.toLocaleString("en-US", endOptions);
	}

	const [open, setOpen] = useState(false);
	const handleClose = () => {
		setOpen(false);
	};
	const handleOpen = () => {
		setOpen(true);
	};

	const dateEvent = `${formattedStartDate} - ${formattedEndDate}`;
	return (
		<div className="bg-white py-2 px-[28px] rounded-[8px] text-[#42526e] absolute pb-10 top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] w-[448px]">
			<div className="flex justify-end gap-4 items-center">
				<button
					onClick={() => removeEvent()}
					className="normal-case font-medium my-1">
					<Tooltip title="Delete Event">
						<IconButton
							sx={{
								color: "black",
							}}>
							<RiDeleteBin6Line size={20} />
						</IconButton>
					</Tooltip>
				</button>
				<button
					onClick={() => {
						openModalChild(
							<CalendarScheduleForm
								payload={payload}
								action="Edit"
								onCloseModal={onCloseModalChild}
							/>,
						);
					}}>
					<Tooltip title="Edit Event">
						<IconButton
							sx={{
								color: "black",
							}}>
							<FiEdit2 size={20} />
						</IconButton>
					</Tooltip>
				</button>
				<div onClick={onCloseModal}>
					<Tooltip title="Close modal">
						<IconButton
							sx={{
								color: "black",
							}}>
							<GrClose size={20} />
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<div className="flex flex-col gap-5 mt-[3px]">
				<div className="flex gap-6">
					<Tooltip
						title="Color room event"
						sx={{
							color: "black",
						}}>
						<span
							className="h-[16px] w-[16px] rounded-md inline-block"
							style={{
								backgroundColor: ` ${payload?.backgroundColor}`,
							}}></span>
					</Tooltip>
					<div>
						<h2 className="text-[22px] mb-3">{payload?.title}</h2>
						<div>{dateEvent}</div>
					</div>
				</div>
				<div className="flex gap-5">
					<Tooltip title="Location">
						<span>
							<LiaMapMarkerAltSolid size={22} />
						</span>
					</Tooltip>
					<span>{payload?.location}</span>
				</div>
				<div className="flex gap-5">
					<Tooltip title="Room name">
						<span>
							<BsFillHouseDoorFill size={22} />
						</span>
					</Tooltip>
					<span>{roomName}</span>
				</div>
				<div className="flex gap-5 items-center">
					<Tooltip title="Attendees">
						<span>
							<FiUsers size={20} />
						</span>
					</Tooltip>
					<div className="flex flex-wrap gap-1">
						{attendees.map((item) => (
							<span
								className="bg-[#d9d9de] px-3 py-2 rounded-sm"
								key={uuidv4()}>
								{`${item.email}`}
							</span>
						))}
					</div>
				</div>
				<div className="flex gap-5">
					<Tooltip title="Creator">
						<span>
							<BsCalendarEvent size={22} />
						</span>
					</Tooltip>
					<span>{creator}</span>
				</div>
			</div>
			<Modal open={openChild} onClose={() => setOpenChild(false)}>
				<div>{modalChild}</div>
			</Modal>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={open}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
}
ScheduleInfoPopup.propTypes = {
	payload: PropTypes.object,
	onCloseModal: PropTypes.func.isRequired,
};
export default ScheduleInfoPopup;
