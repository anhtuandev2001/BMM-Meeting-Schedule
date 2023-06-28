// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import { Modal } from "@mui/material";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import { MdDeleteSweep } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { deleteSchedule } from "../../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import CalendarScheduleForm from "../CalendarScheduleForm";
function ScheduleInfoPopup({ payload, onCloseModal }) {
	const dispatch = useDispatch();
	const { status } = useSelector((state) => state.scheduleManagement);
	const [modalChild, setModalChild] = useState(false);
	const [openChild, setOpenChild] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const openModalChild = (child) => {
		setOpenChild(true);
		setModalChild(child);
		// onCloseModal()
	};
	const handleModalChildClose = useCallback(() => {
		setOpenChild(false);
	}, []);
	const removeEvent = () => {
		setIsLoading(true);
		dispatch(deleteSchedule(payload));
	};
	useEffect(() => {
		if (status.info === "success") {
			setIsLoading(false);
			setTimeout(() => {
				setIsLoading(false);
				onCloseModal();
			}, 700);
		}
		if (status.info === "error") {
			setIsLoading(false);
		}
	}, [status]);
	const start = new Date(payload.start.toString());
	const end = new Date(payload.end.toString());

	const { roomsbooked } = useSelector((state) => state.roomManagement);

	const room = roomsbooked.find((room) => room.id == payload.calendarId);

	const roomName = room ? room.name : "No name";

	return (
		<div className="bg-white p-4 w-[315px] rounded-[3px] absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">
			<div>
				<h2 className="text-2xl font-bold mb-4">Meeting: {payload.title}</h2>
				<div>
					<div></div>
					<p className="text-base font-normal">
						Start at : {start.toLocaleString()}
					</p>
					<p className="text-base font-normal">
						End at: {end.toLocaleString()}
					</p>
					<p className="text-base font-normal">Location : {payload.location}</p>
					<p className="text-base font-normal">Room Name : {roomName}</p>
					<p className="text-base font-normal">
						User : {payload.attendees[0]?.email}
					</p>
				</div>
			</div>
			<div className="flex justify-end mt-6 pt-6 border-t ">
				<button
					className="py-1.5 px-3 bg-[#0052CC] text-white rounded-[3px] mr-3"
					onClick={() => {
						openModalChild(
							<CalendarScheduleForm
								payload={payload}
								action="edit"
								onModalClose={handleModalChildClose}
							/>,
						);
					}}>
					Edit
				</button>
				<LoadingButton
					onClick={() => removeEvent()}
					className="py-1.5 px-3 bg-[#DE350B] text-white rounded-[3px]"
					startIcon={<MdDeleteSweep />}
					variant="contained"
					color="error"
					aria-label="fingerprint"
					sx={{
						fontFamily: "Nunito",
						textTransform: "none",
						fontWeight: 300,
					}}
					loadingPosition="start"
					loading={isLoading}>
					<p className="normal-case font-medium">Delete</p>
				</LoadingButton>
			</div>
			<Modal open={openChild} onClose={() => setOpenChild(false)}>
				<div className="">{modalChild}</div>
			</Modal>
		</div>
	);
}
ScheduleInfoPopup.propTypes = {
	payload: PropTypes.object,
	onCloseModal: PropTypes.func.isRequired,
};
export default ScheduleInfoPopup;
