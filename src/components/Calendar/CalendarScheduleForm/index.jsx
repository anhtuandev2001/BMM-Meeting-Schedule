/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import { Backdrop, Button, Popover } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
import axios from "axios";
import { ErrorMessage, Field, FieldArray, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { BiError } from "react-icons/bi";
import { FiChevronDown } from "react-icons/fi";
import { MdClose } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import * as Yup from "yup";
import { clearStatus } from "../../../store/slices/ScheduleManagementSlice/ScheduleManagementSlice";
import {
	createSchedule,
	updateScheduleInfo,
} from "../../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import useAuth from "../../../utils/useAuth";
function CalendarScheduleForm({ payload, action, onCloseModal, time }) {
	const { t } = useTranslation();
	const initialScheduleFormData = {
		room: "",
		title: "",
		addGuests: "",
		start: time ? time.start : "",
		end: time ? time.end : "",
	};
	const dispatch = useDispatch();
	const { status } = useSelector((state) => state.scheduleManagement);
	const roomList = useSelector(
		(state) => state.roomManagement.roomsBooked,
	)?.filter((room) => room.status.toLowerCase());
	const [eventState, setEventState] = useState(initialScheduleFormData);
	const [eventData, setEventData] = useState({});
	const [roomState, setRoomState] = useState({});
	const [guest, setGuest] = useState("");
	const [guests, setGuests] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [isEmailValidate, setIsEmailValidate] = useState(true);
	const { currentUser } = useAuth();
	useEffect(() => {
		if (payload) {
			axios
				.get(`http://localhost:4001/api/calendar/event/${payload.id}`)
				.then((result) => result.data.content)
				.then((data) => {
					const result = {
						title: data.summary,
						room: data.extendedProperties.private.room_id,
						start: data.start.dateTime.slice(0, 19),
						end: data.end.dateTime.slice(0, 19),
					};
					setEventData(data);
					setEventState(result);
					setRoomState(
						roomList?.filter((room) => room.id == Number(result.room))[0],
					);
					setIsLoading(false);
				});
		} else {
			setIsLoading(false);
		}
	}, [payload]);
	const [roomShow, setRoomShow] = useState(false);
	const setFocusElement = (errors) => {
		const ids = Object.keys(errors);
		const id = ids[0];
		document.getElementById(id)?.focus();
	};
	useEffect(() => {
		if (action.toLowerCase() == "edit") {
			if (status.updateSchedule === "success") {
				setIsLoading(false);
				onCloseModal();
				dispatch(clearStatus());
			}
			if (status.updateSchedule === "error") {
				setIsLoading(false);
			}
		}
		if (action.toLowerCase() == "create") {
			if (status.createSchedule === "success") {
				setIsLoading(false);
				onCloseModal();
			}
			if (status.createSchedule === "error") {
				setIsLoading(false);
			}
		}
	}, [status.createSchedule, status.updateSchedule]);
	const validation = Yup.object().shape({
		room: Yup.string().required("Required"),
		title: Yup.string().required("Required"),
		start: Yup.date().min(new Date(), "Invalid time").required("Required"),
		end: Yup.lazy(() =>
			Yup.date("").min(Yup.ref("start"), "Check the time").required("Required"),
		),
		addGuests: Yup.array().of(Yup.string().email("Invalid email format")),
	});

	const handleOnSubmit = (values) => {
		setIsLoading(true);
		const roomInfo = roomList.find((item) => item.id == values.room);
		let time = {
			start: {
				dateTime: new Date(values.start).toJSON(),
				timeZone: "UTC",
			},
			end: {
				dateTime: new Date(values.end).toJSON(),
				timeZone: "UTC",
			},
		};
		if (action.toLowerCase() === "create") {
			const data = {
				colorId: roomInfo.colorId,
				summary: values.title,
				location: roomInfo.location,
				creator: { email: currentUser?.email },
				is_new_meet: true,
				attendees: [{ email: currentUser?.email }, ...guests],
				...time,
				extendedProperties: {
					room_id: roomInfo.id,
				},
			};
			dispatch(createSchedule(data));
		}
		if (action.toLowerCase() === "edit") {
			const data = {
				payload: {
					creator: { email: currentUser?.email },
					attendees: [{ email: currentUser?.email }],
					recurrence: ["RRULE:FREQ=MONTHLY;COUNT=1"],
					colorId: roomInfo.colorId,
					summary: values.title,
					location: roomInfo.location,
					...time,
					extendedProperties: {
						room_id: roomInfo.id,
					},
					is_remove_meet: true,
					update_type: "all",
				},
				id: eventData.id,
			};
			dispatch(updateScheduleInfo(data));
		}
	};

	const handleGuestChange = (e) => {
		setIsEmailValidate(true);
		setGuest(e.target.value);
	};

	const handleGuestKeyDown = (e) => {
		if (e.key === "Enter") {
			e.preventDefault();
			if (guest.trim() !== "") {
				if (!Yup.string().email().isValidSync(guest.trim())) {
					setIsEmailValidate(false);
					return;
				}
				let isPresent = false;
				for (let i = 0; i < guests.length; i++) {
					if (guests[i].email === guest) {
						isPresent = true;
						break;
					}
				}
				if (isPresent) {
					setIsEmailValidate(false);
					return;
				}
				setIsEmailValidate(true);
				setGuests([...guests, { email: guest.trim() }]);
				setGuest("");
			}
		}
	};

	const removeGuest = (index) => {
		const updatedGuests = [...guests];
		updatedGuests.splice(index, 1);
		setGuests(updatedGuests);
	};
	return (
		<div className="absolute top-[50%] left-[50%] translate-x-[-50%] mx-auto  shadow py-6 px-5  text-[#42526E] translate-y-[-50%] w-full sm:w-[600px] max-h-[600px] overflow-scroll rounded-md bg-white">
			<div>
				<h3 className="text-xl font-bold text-[#172B4D]">
					{t(action.toLowerCase())} {t("schedule")}
				</h3>
				<Formik
					enableReinitialize={action.toLowerCase() == "edit"}
					initialValues={eventState}
					onSubmit={(values) => {
						handleOnSubmit(values);
					}}
					validationSchema={validation}>
					{({ errors, touched, isSubmitting }) => (
						<Form>
							<div>
								{/* selection room  */}
								<div className="py-3 relative">
									<div id="room" className="">
										<h4 className="my-2 font-bold  text-md text-[#172B4D]">
											{t("schedule")} {t("room")} :
										</h4>
										<div
											className={`flex justify-between bg-[#F4F5F7] p-2 rounded-[3px] border-2 border-white   ${
												touched["room"] && errors["room"]
													? " border-red-400"
													: " "
											}`}>
											<p className="my-auto">{roomState?.name}</p>
											<div className="slide">
												<Button
													className="p-0"
													onClick={(e) => {
														setRoomShow(
															// @ts-ignore
															e.target.parentElement.parentElement
																.parentElement,
														);
													}}>
													<FiChevronDown />
												</Button>
											</div>
										</div>
										<Popover
											// id="room"
											className="w-full"
											open={Boolean(roomShow)}
											anchorEl={roomShow}
											onClose={() => setRoomShow(false)}
											anchorOrigin={{
												vertical: "bottom",
												horizontal: "left",
											}}>
											<div className="p-3 flex flex-col max-h-60 overflow-y-scroll">
												{([] && roomList)?.map((item) => {
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
									<div className=" absolute">
										{errors["room"] && touched["room"] ? (
											<div className="text-red-500 font-normal text-base py-1  flex my-auto">
												<BiError className="my-auto" />{" "}
												<ErrorMessage name="room" />
											</div>
										) : (
											<div className=""></div>
										)}
									</div>
								</div>
								{/* name Schedule  */}
								<div className="py-3 relative">
									<h4 className="my-2 font-bold text-md text-[#172B4D]">
										{t("schedule")} {t("title")} :
									</h4>
									<Field
										className={`${
											touched["title"] && errors["title"]
												? "border-red-400"
												: " "
										} border-2 border-white  p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none mb-1 `}
										id="title"
										name="title"
									/>
									<div className="absolute">
										{errors["title"] && touched["title"] ? (
											<div className="text-red-500 font-normal text-base py-1  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="title" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
								{/* Add guests  */}
								<FieldArray name="addGuests">
									{() => (
										<div className="py-3 relative">
											<h4 className="my-2 font-bold text-md text-[#172B4D]">
												{t("Add Guests")}:
												{isEmailValidate || (
													<span className="ml-2 text-red-600">
														Please enter the correct email
													</span>
												)}
											</h4>
											<div className="flex items-center">
												<input
													type="text"
													value={guest}
													onChange={handleGuestChange}
													onKeyDown={handleGuestKeyDown}
													placeholder={t("Enter email")}
													className="border-2 border-white  p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none mb-1"
												/>
											</div>
											<div className="mt-2 flex flex-wrap">
												{guests.map((guest, index) => (
													<div
														key={index}
														className="flex items-center bg-gray-200 rounded-md px-2 py-1 mr-2 mb-2">
														<span className="mr-2">{guest.email}</span>
														<MdClose
															onClick={() => removeGuest(index)}
															className="text-red-500 cursor-pointer"
														/>
													</div>
												))}
											</div>
										</div>
									)}
								</FieldArray>
							</div>
							{/* time  */}
							<div className="flex justify-between py-3">
								<div className="w-[40%] relative">
									<div className="flex justify-between">
										<div className="py-2">
											<label
												htmlFor="name"
												className="font-bold text-md text-[#172B4D]">
												{t("schedule")} {t("start")}:
											</label>
										</div>
									</div>
									<Field
										type="datetime-local"
										className={`mb-1 p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none border-2 border-white ${
											touched["start"] && errors["start"]
												? " border-red-400"
												: " "
										}`}
										id="start"
										name="start"
										min={Date.now()}
										language="en"
									/>
									<div className="absolute">
										{errors["start"] && touched["start"] ? (
											<div className="text-red-500 font-normal text-base py-1  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="start" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
								<div className="w-[40%] relative">
									<div className="flex justify-between">
										<div className="py-2">
											<label
												htmlFor="name"
												className="font-bold text-md text-[#172B4D]">
												{t("schedule")} {t("end")} :
											</label>
										</div>
									</div>
									<label htmlFor="end">
										<Field
											type="datetime-local"
											className={`p-2 bg-[#F4F5F7] rounded-[3px] w-full outline-none  border-2 border-white ${
												touched["end"] && errors["end"]
													? " border-red-400"
													: " "
											}	`}
											id="end"
											language="en"
											name="end"
										/>
									</label>
									<div className="absolute">
										{errors["end"] && touched["end"] ? (
											<div className="text-red-500 font-normal text-base py-1  flex my-auto">
												<BiError className="my-auto py-0" />
												<ErrorMessage name="end" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
							</div>
							{isSubmitting ? setFocusElement(errors) : ""}
							<div className="flex justify-end mt-6">
								<button className="py-2 px-4" onClick={onCloseModal}>
									{t("discard")}
								</button>
								<LoadingButton
									type="submit"
									variant="contained"
									aria-label="fingerprint"
									sx={{
										fontFamily: "Nunito",
										textTransform: "capitalize",
										fontWeight: 300,
									}}
									loading={isLoading}>
									{t(action.toLowerCase())}
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
	onCloseModal: PropTypes.func.isRequired,
	time: PropTypes.object,
};
export default CalendarScheduleForm;
