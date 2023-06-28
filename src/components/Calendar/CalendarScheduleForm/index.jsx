// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import { Button, Popover } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { BiError } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { initialScheduleFormData } from "../../../assets/mockData/calendarInitData/calendarinitData";
import {
	createSchedule,
	updateScheduleInfo,
} from "../../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import useAuth from "../../../utils/useAuth";
function CalendarScheduleForm({ payload, action, onModalClose }) {
	const dispatch = useDispatch();
	const ScheduleState = useSelector((state) => state.scheduleManagement);
	const roomList = useSelector(
		(state) => state.roomManagement.roomsbooked,
	).filter((room) => room.status.toLowerCase() !== "locked");
	const initialEvent = payload
		? {
				title: payload.title,
				room: payload.calendarId,
				start: new Date(payload?.start.toString()).toISOString().slice(0, 16),
				end: new Date(payload?.end.toString()).toISOString().slice(0, 16),
		  }
		: initialScheduleFormData;
	const [roomShow, setRoomShow] = useState(false);
	const { currentUser } = useAuth();
	const emailEvent = currentUser?.email;
	const [roomState, setRoomState] = useState(
		payload ? roomList.filter((room) => room.id == payload.calendarId)[0] : {},
	);
	const [isLoading, setIsLoading] = useState(false);
	useEffect(() => {
		if (ScheduleState.status.info === "success") {
			setIsLoading(false);
			setTimeout(() => {
				onModalClose();
			}, 500);
		}
		if (ScheduleState.status.info === "error") {
			setIsLoading(false);
		}
	}, [ScheduleState]);
	const validation = Yup.object().shape({
		room: Yup.string().required("Required"),
		title: Yup.string().required("Required"),
		start: Yup.date().required("Required"),
		end: Yup.lazy(() => Yup.date("").min(Yup.ref("start"), "Check the time")),
	});
	const handleOnSubmit = (values) => {
		setIsLoading(true);
		const roomInfo = roomList.find((item) => item.id == values.room);
		let time = {
			start: {
				dateTime: `${values.start}:00+07:00`,
				timeZone: "Asia/Ho_Chi_Minh",
			},
			end: {
				dateTime: `${values.end}:00+07:00`,
				timeZone: "Asia/Ho_Chi_Minh",
			},
		};
		if (action.toLowerCase() === "create") {
			const data = {
				colorId: roomInfo.colorId,
				summary: values.title,
				location: roomInfo.location,
				creator: { email: "sdf@gami.com" },
				is_new_meet: true,
				attendees: [{ email: emailEvent }],
				...time,
				extendedProperties: {
					room_id: roomInfo.id,
				},
			};
			dispatch(createSchedule(data));
		}
		if (action.toLowerCase() === "edit") {
			const data = {
				...payload,
				colorId: roomInfo.colorId,
				summary: values.title,
				location: roomInfo.location,
				is_new_meet: false,
				...time,
				extendedProperties: {
					room_id: roomInfo.id,
				},
			};
			dispatch(updateScheduleInfo(data));
		}
	};
	return (
		<div className="absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] max-w-[600px] w-full px-3">
			<div className="bg-white mx-auto my-32 shadow py-6 px-5 rounded-md text-[#42526E]">
				<h3 className="text-xl font-bold text-[#172B4D]">{action} Schedule</h3>
				<Formik
					initialValues={{ ...initialEvent }}
					onSubmit={(values) => {
						handleOnSubmit(values);
					}}
					validationSchema={validation}>
					{({ errors, touched, values }) => (
						<Form>
							<div>
								{/* selection room  */}
								<div className="mt-4">
									<div className="my-2">
										<div className="flex justify-between">
											<div>
												<h4 className="my-4 font-bold  text-md text-[#172B4D]">
													Schedule Room :
												</h4>
											</div>
											{errors["title"] && touched["title"] ? (
												<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
													<BiError className="my-auto py-0" />
													<ErrorMessage name="title" />
												</div>
											) : (
												""
											)}
										</div>
										<div className="flex justify-between bg-[#F4F5F7] p-2 rounded-[3px]">
											<p className="my-auto">{roomState?.name}</p>
											<div className="slide">
												<Button
													className="p-0"
													onClick={(e) => {
														setRoomShow(
															e.target.parentElement.parentElement.parentElement
																.parentElement,
														);
													}}>
													<FiChevronDown />
												</Button>
											</div>
										</div>
									</div>
									<Popover
										id="room"
										className="w-full"
										open={Boolean(roomShow)}
										anchorEl={roomShow}
										onClose={() => setRoomShow(false)}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "left",
										}}>
										<div className="p-3 flex flex-col max-h-60 overflow-y-scroll">
											{([] && roomList).map((item) => {
												return (
													<label
														key={item.name}
														onClick={() => setRoomState(item)}
														className="p-2 text-lg bg-gray-200 my-1 rounded-[3px] hover:opacity-70 cursor-pointer">
														<Field
															type="radio"
															name="room"
															value={`${item.id}`}
														/>
														{item.name} - {item.location}
													</label>
												);
											})}
										</div>
									</Popover>
								</div>
								{/* name Schedule  */}
								<div className="my-4">
									<div className="flex justify-between">
										<div className="py-2">
											<label
												htmlFor="title"
												className="font-bold text-md text-[#172B4D]">
												Schedule Title :
											</label>
										</div>
										{errors["title"] && touched["title"] ? (
											<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="title" />
											</div>
										) : (
											""
										)}
									</div>
									<Field
										className="p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none"
										id="title"
										name="title"
									/>
								</div>
							</div>
							{/* time  */}
							<div className="flex justify-between">
								<div className="w-[40%]">
									<div className="flex justify-between">
										<div className="py-2">
											<label
												htmlFor="name"
												className="font-bold text-md text-[#172B4D]">
												Schedule Start:
											</label>
										</div>
										{errors["start"] && touched["start"] ? (
											<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="start" />
											</div>
										) : (
											""
										)}
									</div>
									<Field
										type="datetime-local"
										className="p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none"
										id="start"
										name="start"
										language="en"
										value={values.start}
									/>
								</div>
								<div className="w-[40%]">
									<div className="flex justify-between">
										<div className="py-2">
											<label
												htmlFor="name"
												className="font-bold text-md text-[#172B4D]">
												Schedule End :
											</label>
										</div>
										{errors["end"] && touched["end"] ? (
											<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="end" />
											</div>
										) : (
											""
										)}
									</div>
									<label htmlFor="end">
										<Field
											type="datetime-local"
											className="p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none"
											id="end"
											language="en"
											name="end"
											value={values.end}
										/>
									</label>
								</div>
							</div>
							<div className="flex justify-end mt-6">
								<button className="py-2 px-4" onClick={onModalClose}>
									Discard
								</button>
								<LoadingButton
									startIcon={" "}
									loadingPosition="start"
									type="submit"
									variant="contained"
									aria-label="fingerprint"
									sx={{
										fontFamily: "Nunito",
										textTransform: "none",
										fontWeight: 300,
									}}
									loading={isLoading}>
									{action}
								</LoadingButton>
							</div>
						</Form>
					)}
				</Formik>
			</div>
		</div>
	);
}
CalendarScheduleForm.propTypes = {
	payload: PropTypes.object,
	action: PropTypes.string,
	onModalClose: PropTypes.func.isRequired,
};
export default CalendarScheduleForm;
