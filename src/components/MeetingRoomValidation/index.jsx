// @ts-nocheck
import { Button, Popover } from "@mui/material";
// import { Alert, AlertTitle, Button, Popover } from "@mui/material";
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
	InitColorSelection,
} from "../../assets/mockData/formDataForm/formDataForm";
import { useDispatch } from "react-redux";
import {
	createMeetingRoom,
	updateRoomInfo,
} from "../../store/slices/roomManagementSlice";
import axios from "axios";
function MeetingRoomValidation({ payload, message, action, modalClose }) {
	const [colorSelection, setColorSelection] = useState(InitColorSelection);
	useEffect(() => {
		axios.get("http://localhost:4001/api/calendar/color").then((result) => {
			const payload = result.data.content;
			setColorSelection(payload);
		});
	}, []);
	const [deviceShow, setDeviceShow] = useState(null);
	const [roomColorShow, setRoomColorShow] = useState(null);
	// only listen formik of value.device change to re-render component
	const [isDeviceValueChange, setIsDeviceValueChange] = useState(false);
	const validation = Yup.object().shape({
		name: Yup.string().required("required"),
		description: Yup.string().required("required"),
		capacity: Yup.number().required("required"),
		location: Yup.string().required("required"),
	});
	// process data when submitting form
	const dispatch = useDispatch();
	const handleOnSubmit = (values) => {
		const configValues = {
			...values,
			status: "Opening",
		};
		console.log(configValues);
		if (action === "Create") {
			dispatch(createMeetingRoom(configValues));
		} else if (action === "Update") {
			const { createdAt, updatedAt, id, ...valuesConfig } = values;
			console.log(createdAt, updatedAt, id);
			dispatch(updateRoomInfo({ id: values.id, dataEditRoom: valuesConfig }));
		}
	};
	return (
		<div className=" bg-white p-6 text-left text-[#172B4D] rounded-[3px]">
			<h3 className="text-xl font-medium mb-4">{message}</h3>
			<h5 className="text-sm font-normal mb-2">Setup the meeting room</h5>
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
					// setValidationSuccess(true);
					console.log(values);
					handleOnSubmit(values);
					await setTimeout(() => {
						modalClose();
					}, 1000);
				}}
				// validate
				validationSchema={validation}>
				{({ errors, touched, values }) => (
					<Form>
						<div className="max-h-[300px] overflow-y-scroll px-2">
							{formValidation.map((item) => {
								return (
									<div key={item.name} className="py-2">
										<div className="flex justify-between">
											<div className="my-2">
												<label
													className="text-sm font-bold"
													htmlFor={item.name}>
													{item.label} :
												</label>
											</div>
											{errors[item.name] && touched[item.name] ? (
												<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
													<BiError className="my-auto py-0" />
													<ErrorMessage name={item.name} />
												</div>
											) : (
												""
											)}
										</div>
										<div>
											<Field
												className="p-2 border-[2px] rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full outline-none"
												id={item.name}
												name={item.name}
												type="text"
											/>
										</div>
									</div>
								);
							})}
							<div className="py-2">
								<div className="flex justify-between">
									<div className="my-2 font-bold text-sm ">
										<label htmlFor="description">Description :</label>
									</div>
									{errors["description"] && touched["description"] ? (
										<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
											<BiError className="my-auto py-0" />
											<ErrorMessage name="description" />
										</div>
									) : (
										""
									)}
								</div>
								<div>
									<Field
										className="p-2 border-[2px] rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full outline-none"
										id="description"
										name="description"
										as="textarea"
										rows="5"
									/>
								</div>
							</div>
							{/* device  */}
							<div className="py-2 relative" id="devices">
								<p className="font-bold text-sm my-2">Devices :</p>
								<div className="flex justify-between bg-[#F4F5F7]  rounded-[3px] p-2">
									<div className="flex justify-start">
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
								{/* {deviceShow && (

							)} */}
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
										<div className="bg-white rounded-xl  w-full shadow-lg p-2 slide-in grid grid-cols-4">
											{checkboxValues.map((item, index) => {
												return (
													<label
														htmlFor={item.value}
														className=" py-1 flex my-3 mx-1 rounded-[3px] bg-gray-100 p-2 hover:cursor-pointer hover:opacity-80"
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
										<label htmlFor="capacity">Capacity :</label>
									</div>
									{errors["capacity"] && touched["description"] ? (
										<div className="bg-red-200 px-1 rounded-md text-red-500 font-black text-base  flex my-auto">
											<BiError className="my-auto py-0" />
											<ErrorMessage name="capacity" />
										</div>
									) : (
										""
									)}
								</div>
								<div>
									<Field
										className="p-2 border-[2px] rounded-[3px] border-[##DFE1E6] bg-[#FAFBF] w-full outline-none"
										id="capacity"
										name="capacity"
										rows="5"
									/>
								</div>
							</div>
							{/* roomColor  */}
							<div className="py-2">
								<p className="font-bold text-sm my-2 block">Meeting Color :</p>
								<div className="flex py-1 px-2 justify-between bg-gray-100 py-auto hover:cursor-pointer rounded-[3px]">
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
											aria-describedby="roomColor"
											onClick={(e) =>
												setRoomColorShow(
													e.target.parentElement.parentElement.parentElement
														.parentElement,
												)
											}>
											<FaAngleDown className="text-[#172B4D]" />
										</Button>
									</div>
								</div>
								{/* room color slide */}
								<Popover
									id="roomColor"
									open={Boolean(roomColorShow)}
									anchorEl={roomColorShow}
									onClose={() => setRoomColorShow(false)}
									anchorOrigin={{
										vertical: "bottom",
										horizontal: "left",
									}}>
									<div className=" bg-white rounded-xl  w-full shadow-lg p-2 slide-in grid grid-cols-3">
										{Object.keys(colorSelection).reduce(
											(accumulate, currentValue) => {
												const data = colorSelection[currentValue];
												const HTMLelement = (
													<label
														key={data.background}
														className="flex justify-start rounded-md m-1 bg-gray-200 hover:opacity-90 hover:cursor-pointer p-2">
														<Field
															value={currentValue}
															name="colorId"
															type="radio"
															className="mr-2"
														/>
														{data.background}
														<div
															style={{ backgroundColor: `${data.background}` }}
															className="p-2 py-2 border-4 border-white rounded-md ml-2 w-full"></div>
													</label>
												);
												return [...accumulate, HTMLelement];
											},
											[],
										)}
									</div>
								</Popover>
							</div>
						</div>
						<div className="flex justify-end mt-10	">
							<button type="button" onClick={modalClose}>
								Discard
							</button>
							<div className="bg-[#0052CC] text-white  ml-2 text-base rounded-[3px] ">
								<button type="submit" className="px-2 py-1">
									{action}
								</button>
							</div>
						</div>
					</Form>
				)}
			</Formik>
			{/* {validationSuccess && (
				<Alert
					className="fixed  slide-right-in w-[400px] top-[5%] right-[10px]"
					severity="success">
					<AlertTitle>Success</AlertTitle>
					Validation <strong>success</strong>
				</Alert>
			)} */}
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
