// @ts-nocheck
import { Button, Popover } from "@mui/material";
import { ErrorMessage, Field, Form, Formik } from "formik";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BiError } from "react-icons/bi";
import { FaAngleDown } from "react-icons/fa";
import { RiDeleteBack2Fill } from "react-icons/ri";
import * as Yup from "yup";
import {
	checkboxValues,
	formValidation,
} from "../../../assets/mockData/formDataForm/formDataForm";
import { useDispatch, useSelector } from "react-redux";
import {
	createMeetingRoom,
	updateRoomInfor,
} from "../../../store/slices/roomManagementSlice";
import { FaSpinner } from "react-icons/fa";
import { useFormikContext } from "formik";
import { useTranslation } from "react-i18next";
import { isEmpty, isNil } from "lodash";
import { FixedSizeList as List } from "react-window";
function MeetingRoomValidation({ payload, message, action, modalClose }) {
	const { t } = useTranslation();
	const [deviceShow, setDeviceShow] = useState(null);
	const [roomColorShow, setRoomColorShow] = useState(null);
	// only listen formik of value.device change to re-render component
	const [isDeviceValueChange, setIsDeviceValueChange] = useState(false);
	const { colorSelection, statusOfDialog } = useSelector(
		(state) => state.roomManagement,
	);
	const validation = Yup.object().shape({
		name: Yup.string()
			.required(t("required"))
			.max(32, t("name-has-a-maximum-of-32-characters"))
			.min(3, t("name-has-a-minimum-of-3-characters")),
		location: Yup.string()
			.required(t("required"))
			.max(55, t("location-has-a-maximum-of-55-characters")),
		capacity: Yup.number()
			.typeError(t("capacity-must-be-a-number"))
			.integer(t("capacity-must-be-a-integer-number"))
			.positive(t("description-has-a-maximum-of-55-characters"))
			.required(t("required")),
		colorId: Yup.string().required(t("required")),
		description: Yup.string().max(
			55,
			"Description has a maximum of 55 characters",
		),
	});
	// process data when submitting form
	const dispatch = useDispatch();
	const handleOnSubmit = async (values) => {
		const configValues = {
			...values,
			status: "Opening",
		};
		if (action === "Create") {
			await dispatch(createMeetingRoom(configValues));
		} else if (action === "Update") {
			const valuesConfig = {
				capacity: values.capacity,
				colorId: values.colorId,
				description: values.description,
				devices: values.devices,
				location: values.location,
				name: values.name,
				status: values.status,
			};
			await dispatch(
				updateRoomInfor({ id: values.id, dataEditRoom: valuesConfig }),
			);
		}
	};

	useEffect(() => {
		if (statusOfDialog === "fulfilled") {
			modalClose();
		}
	}, [statusOfDialog, modalClose]);

	// focus to error field
	const FocusError = () => {
		const { errors, isSubmitting, isValidating } = useFormikContext();
		useEffect(() => {
			if (isSubmitting && !isValidating) {
				let keys = Object.keys(errors);
				if (keys.length > 0) {
					const selector = `${keys[0]}`;
					const errorElement = document.getElementById(selector);
					if (errorElement) {
						errorElement.focus();
					}
				}
			}
		}, [errors, isSubmitting, isValidating]);
		return null;
	};
	return (
		<div className=" bg-white p-6 text-left text-[#172B4D] rounded-[3px] h-full">
			<h3 className="text-xl font-medium mb-4">{message}</h3>
			<h5 className="text-sm font-normal mb-2">{t("room-form-title")}</h5>
			<Formik
				initialValues={
					payload
						? { ...payload }
						: {
								name: "",
								description: "",
								capacity: "",
								devices: [],
								colorId: "",
								location: "",
						  }
				}
				// submit
				onSubmit={async (values) => {
					await handleOnSubmit(values);
				}}
				// validate
				validationSchema={validation}>
				{({ errors, touched, values }) => (
					<Form className="h-[77%]">
						<div className="overflow-y-scroll px-2 h-full">
							{formValidation.map((item) => {
								return (
									<div key={item.name} className="py-2">
										<div className="flex justify-between">
											<div className="my-2">
												<label
													className="text-sm font-bold"
													htmlFor={item.name}>
													{t("room")} {t("name")} :
												</label>
											</div>
										</div>
										<div className="relative">
											<Field
												className={`p-2 border-[2px] rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full
												${
													errors[item.name] && touched[item.name]
														? "outline outline-2 outline-red-400"
														: "outline-none"
												} `}
												id={item.name}
												name={item.name}
												type="text"
											/>
											<div className="absolute -bottom-5 left-0">
												{errors[item.name] && touched[item.name] ? (
													<div className="px-1 rounded-md text-red-500 font-black text-xs flex my-auto">
														<BiError className="my-auto mr-1" />
														<ErrorMessage name={item.name} />
													</div>
												) : (
													""
												)}
											</div>
										</div>
									</div>
								);
							})}
							<div className="py-2">
								<div className="flex justify-between">
									<div className="my-2 font-bold text-sm ">
										<label htmlFor="description">{t("description")} :</label>
									</div>
								</div>
								<div className="relative">
									<Field
										className={`p-2 border-[2px] break-all rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full outline-none
										${
											errors.description && touched.description
												? "outline outline-2 outline-red-400"
												: "outline-none"
										} `}
										id="description"
										name="description"
										as="input"
										rows="2"
									/>
									<div className="absolute -bottom-5 -left-500">
										{errors.description && touched.description ? (
											<div className="px-1 rounded-md text-red-500 font-black text-xs flex my-auto">
												<BiError className="my-auto mr-1" />
												<ErrorMessage name="description" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
							</div>
							{/* device  */}
							<div className="py-2 relative" id="devices">
								<p className="font-bold text-sm my-2">{t("devices")} :</p>
								<div className="flex justify-between bg-[#F4F5F7]  rounded-[3px] p-2">
									<div className="flex justify-start flex-wrap">
										{values.devices.map((item) => {
											return (
												<div
													key={item}
													className="flex px-1 bg-gray-300 my-auto mr-3 rounded-[3px]">
													<p className="pr-2 text-sm my-auto">{item}</p>
													<button
														type="button"
														onClick={() => {
															values.devices = values.devices.filter(
																(data) => data !== item,
															);
															setIsDeviceValueChange(!isDeviceValueChange);
														}}>
														<RiDeleteBack2Fill />
													</button>
												</div>
											);
										})}
									</div>
									<div className="flex">
										<button
											type="button"
											onClick={() => {
												values.devices = [];
												setIsDeviceValueChange(!isDeviceValueChange);
											}}
											className="p-1">
											<RiDeleteBack2Fill />
										</button>
										<Button
											aria-describedby="devices"
											className="p-1"
											onClick={(e) =>
												setDeviceShow(
													e.target.parentElement.parentElement.parentElement,
												)
											}>
											<FaAngleDown className="text-[#172B4D]" />
										</Button>
									</div>
								</div>
								{/* device slide  */}
								<div className="absolute ">
									<Popover
										id="devices"
										open={Boolean(deviceShow)}
										anchorEl={deviceShow}
										onClose={() => setDeviceShow(false)}
										anchorOrigin={{
											vertical: "bottom",
											horizontal: "left",
										}}>
										<div className="bg-white rounded-xl  w-full shadow-lg p-2 slide-in grid grid-cols-1">
											{checkboxValues.map((item, index) => {
												return (
													<label
														htmlFor={item.value}
														className=" py-1 flex my-3 mx-1 rounded-md bg-gray-100 p-2 hover:cursor-pointer hover:opacity-80"
														key={index}>
														<Field
															id={item.value}
															name="devices"
															type="checkbox"
															value={item.value}
															className="mr-2"
														/>
														<p className="">{item.value}</p>
													</label>
												);
											})}
										</div>
									</Popover>
								</div>
							</div>
							{/* capacity  */}
							<div className="py-2">
								<div className="flex justify-between">
									<div className="my-2 font-bold text-sm">
										<label htmlFor="capacity">{t("capacity")} :</label>
									</div>
								</div>
								<div className="relative">
									<Field
										className={`p-2 border-[2px] rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full
										${
											errors.capacity && touched.capacity
												? "outline outline-2 outline-red-400"
												: "outline-none"
										} `}
										id="capacity"
										name="capacity"
										rows="5"
									/>
									<div className="absolute -bottom-5 left-0">
										{errors.capacity && touched.capacity ? (
											<div className="px-1 rounded-md text-red-500 font-black text-xs flex my-auto">
												<BiError className="my-auto mr-1" />
												<ErrorMessage name="capacity" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
							</div>
							{/* roomColor  */}
							<div className="py-2">
								<p
									className={`font-bold text-sm my-2 block ${
										isEmpty(colorSelection) ? "text-gray-400" : ""
									}`}>
									{t("meeting")} {t("color")} :
								</p>
								<div
									className={`flex py-1 px-2 justify-between bg-gray-100 py-auto hover:cursor-pointer rounded-[3px] relative
												${
													errors.colorId && touched.colorId
														? "outline outline-2 outline-red-400"
														: "outline-none"
												}`}>
									<div className=" w-[40%] my-auto flex ">
										<p>{colorSelection[values.colorId]?.background}</p>
										<div
											style={{
												backgroundColor: `${
													colorSelection[values.colorId]?.background
												}`,
											}}
											className="p-2 py-2 rounded-md ml-2 w-full"></div>
									</div>
									<div className="p-1 ">
										<Button
											disabled={isEmpty(colorSelection)}
											aria-describedby="roomColor"
											onClick={(e) =>
												setRoomColorShow(
													e.target.parentElement.parentElement.parentElement
														.parentElement,
												)
											}>
											<FaAngleDown
												className={`${
													isEmpty(colorSelection)
														? "text-gray-400"
														: "text-[#172B4D]"
												}`}
											/>
										</Button>
									</div>
									<div className="absolute -bottom-5 left-0">
										{errors.colorId && touched.colorId ? (
											<div className="px-1 rounded-md text-red-500 font-black text-xs flex my-auto">
												<BiError className="my-auto mr-1" />
												<ErrorMessage name="colorId" />
											</div>
										) : (
											""
										)}
									</div>
								</div>
								{/* room color slide */}
								<Popover
									id="roomColor"
									open={Boolean(roomColorShow)}
									anchorEl={roomColorShow}
									onClose={() => setRoomColorShow(false)}
									anchorOrigin={{
										vertical: "center",
										horizontal: "center",
									}}
									transformOrigin={{
										vertical: "bottom",
										horizontal: "center",
									}}>
									<div className=" bg-white rounded-xl  w-full shadow-lg p-2 slide-in grid grid-cols-1 overflow-hidden">
										{!isNil(colorSelection) && (
											<List
												style={{ overflowX: "hidden" }}
												height={300}
												width={300}
												itemCount={Object.keys(colorSelection).length}
												itemSize={40}>
												{({ index, style }) => {
													const data = colorSelection[index + 1];
													return (
														<label
															style={style}
															key={data?.background}
															className="flex justify-start m-1 bg-gray-200 hover:opacity-90 hover:cursor-pointer p-2">
															<Field
																value={index + 1}
																name="colorId"
																type="radio"
																className="mr-2"
																checked={values.colorId == index + 1}
															/>
															<span className="w-24 inline-block">
																{data?.background}
															</span>
															<div
																style={{
																	backgroundColor: `${data?.background}`,
																}}
																className="p-2 py-2 border-4 border-white rounded-md ml-2 w-full"></div>
														</label>
													);
												}}
											</List>
										)}
									</div>
								</Popover>
							</div>
						</div>
						<div className="flex justify-end mt-10	">
							{statusOfDialog === "pending" ? (
								<button type="button" disabled>
									{t("discard")}
								</button>
							) : (
								<button type="button" onClick={modalClose}>
									{t("discard")}
								</button>
							)}
							<div className="bg-[#0052CC] text-white  ml-2 text-base rounded-[3px] ">
								<button type="submit" className="px-2 py-1">
									{statusOfDialog === "pending" ? (
										<div className="relative">
											<span className="inline-block h-0 overflow-hidden invisible">
												{t(action.toLowerCase())}
											</span>
											<span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
												<FaSpinner className="animate-spin" />
											</span>
										</div>
									) : (
										t(action.toLowerCase())
									)}
								</button>
							</div>
						</div>
						<FocusError />
					</Form>
				)}
			</Formik>
		</div>
	);
}

MeetingRoomValidation.propTypes = {
	payload: PropTypes.object,
	message: PropTypes.string,
	action: PropTypes.string,
	modalClose: PropTypes.func.isRequired,
};
export default MeetingRoomValidation;
