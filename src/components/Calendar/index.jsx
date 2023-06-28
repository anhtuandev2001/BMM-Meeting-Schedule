// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import { Modal } from "@mui/material";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { useEffect, useRef, useState, useCallback } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FaServer } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { calendarOptions } from "../../assets/mockData/calendarInitData/calendarinitData";
import { handleFinalScheduleList } from "../../store/slices/ScheduleManagementSlice/ScheduleManagementSlice";
import {
	getColorSelection,
	getScheduleList,
	updateScheduleOnDrag,
} from "../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import ScheduleInfoPopup from "../Calendar/ScheduleInfoPopup";
import ButtonCalendar from "./ButtonCalendar";
import CalendarFilters from "./CalendarFilters";
import { scheduleListRemainingSelector } from "./selector";

export function CalenderPage() {
	const {
		ScheduleList = [],
		colorSelection = [],
		createSchedule,
		updateSchedule,
		deleteSchedule,
		status,
	} = useSelector((state) => state.scheduleManagement);
	const viewFileChange = useSelector((state) => state.filtersCalendar.view);
	const finalScheduleList = useSelector(scheduleListRemainingSelector);
	const [scheduleState, setScheduleState] = useState([]);
	const [awaitUpdate, setAwaitUpdate] = useState(false);
	const [isGetScheduleListFalse, setIsGetScheduleListFalse] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [isModalShow, setIsModalShow] = useState(false);
	const [modalChild, setModalChild] = useState(null);
	const [currentYearMonth, setCurrentYearMonth] = useState("");
	const [currentWeek, setCurrentWeek] = useState("");
	const [open, setOpen] = useState(false);
	const dispatch = useDispatch();
	const calendarRef = useRef();

	useEffect(() => {
		setScheduleState(finalScheduleList);
	}, [finalScheduleList]);

	useEffect(() => {
		setIsLoading(true);
		dispatch(getColorSelection());
		dispatch(getScheduleList());
	}, [dispatch, createSchedule, updateSchedule, deleteSchedule]);

	useEffect(() => {
		if (ScheduleList.length > 0 && Object.keys(colorSelection).length > 0) {
			setIsLoading(false);
			dispatch(handleFinalScheduleList({ ScheduleList, colorSelection }));
			handleClose();
		} else if (ScheduleList.length === 0 && status.info === "error") {
			setIsLoading(false);
			setIsGetScheduleListFalse(true);
			handleClose();
		} else {
			handleOpen();
		}
	}, [ScheduleList, colorSelection]);

	const ReRenderComponent = () => {
		setAwaitUpdate(!awaitUpdate);
	};

	// modal show state
	const onModalOpen = (modalChild) => {
		setModalChild(modalChild);
		setIsModalShow(true);
	};
	const onModalClose = useCallback(() => {
		setIsModalShow(false);
		ReRenderComponent();
	}, []);

	const onBeforeUpdateEvent = (e) => {
		const { event, changes } = e;
		dispatch(updateScheduleOnDrag(event, changes));
	};

	const onAfterRenderEvent = () => {};
	const onClickEvent = (event) => {
		onModalOpen(
			<ScheduleInfoPopup payload={event.event} onCloseModal={onModalClose} />,
		);
	};

	// backDrop
	const handleClose = () => {
		setOpen(false);
	};
	const handleOpen = () => {
		setOpen(true);
	};
	//

	// click change calendar view
	const handleClickNextButton = () => {
		const calendarInstance = calendarRef.current.getInstance();
		calendarInstance.prev();
		updateCurrentYearMonth(calendarInstance);
		updateCurrentWeek(calendarInstance);
	};

	const handleClickPrevButton = () => {
		const calendarInstance = calendarRef.current.getInstance();
		calendarInstance.next();
		updateCurrentYearMonth(calendarInstance);
		updateCurrentWeek(calendarInstance);
	};

	const handleClickToday = () => {
		const calendarInstance = calendarRef.current.getInstance();
		calendarInstance.today();
		updateCurrentYearMonth(calendarInstance);
		updateCurrentWeek(calendarInstance);
	};

	const updateCurrentYearMonth = (calendarInstance) => {
		const current = calendarInstance.getDate();
		const year = current.getFullYear();
		const month = current.getMonth() + 1;
		const day = current.getDate();
		let formattedDate = `${year}.${month.toString().padStart(2, "0")}`;

		if (viewFileChange === "day") {
			formattedDate += `.${day.toString().padStart(2, "0")}`;
		}

		setCurrentYearMonth(formattedDate);
	};

	const updateCurrentWeek = (calendarInstance) => {
		const current = calendarInstance.getDate();
		const startOfWeek = new Date(
			current.getFullYear(),
			current.getMonth(),
			current.getDate() - current.getDay(),
		);
		const endOfWeek = new Date(
			current.getFullYear(),
			current.getMonth(),
			current.getDate() + (6 - current.getDay()),
		);
		const formattedStartDate = `${startOfWeek.getFullYear()}.${(
			startOfWeek.getMonth() + 1
		)
			.toString()
			.padStart(2, "0")}.${startOfWeek.getDate().toString().padStart(2, "0")}`;
		const formattedEndDate = `${endOfWeek.getFullYear()}.${(
			endOfWeek.getMonth() + 1
		)
			.toString()
			.padStart(2, "0")}.${endOfWeek.getDate().toString().padStart(2, "0")}`;
		setCurrentWeek(`${formattedStartDate} ~ ${formattedEndDate}`);
	};

	useEffect(() => {
		const calendarInstance = calendarRef.current.getInstance();
		updateCurrentYearMonth(calendarInstance);
		updateCurrentWeek(calendarInstance);
	}, [viewFileChange]);
	//

	return (
		<div className="p-4 calendar-container overflow-scroll">
			<div className="flex flex-col flex-wrap gap-[10px] mb-4">
				<div className="flex flex-wrap gap-2 text-[#6B778C]">
					<span>Calendar</span>
					<span>/</span>
					<span>Meeting Schedule</span>
				</div>
				<div className="flex flex-wrap justify-between">
					<div>
						<h2 className="font-medium text-xl">Meeting Schedule</h2>
					</div>
					<div>
						<ButtonCalendar
							onModalOpen={onModalOpen}
							onModalClose={onModalClose}
						/>
					</div>
				</div>
				<CalendarFilters
					callbacks={[
						handleClickNextButton,
						handleClickPrevButton,
						handleClickToday,
						viewFileChange,
						currentYearMonth,
						currentWeek,
					]}
				/>
			</div>
			{isGetScheduleListFalse ? (
				<div className="mx-auto my-48 w-[500px]">
					<div className="text-8xl ">
						<FaServer className="mx-auto" />
					</div>
					<div className="text-center my-2">
						<h2 className="text-4xl my-4">No response from server</h2>
						<LoadingButton
							size="small"
							onClick={() => {
								setAwaitUpdate(!awaitUpdate);
							}}
							endIcon={<BsFillSendFill />}
							loading={isLoading}
							loadingPosition="end"
							variant="contained">
							<span>Try again</span>
						</LoadingButton>
					</div>
				</div>
			) : (
				<Calendar
					height="900px"
					view={viewFileChange}
					month={{
						dayNames: ["S", "M", "T", "W", "T", "F", "S"],
						visibleWeeksCount: 3,
					}}
					week={{
						daynames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
					}}
					calendars={calendarOptions}
					ref={calendarRef}
					events={scheduleState}
					onClickEvent={onClickEvent}
					onAfterRenderEvent={onAfterRenderEvent}
					onBeforeUpdateEvent={onBeforeUpdateEvent}
				/>
			)}
			<Modal
				open={isModalShow}
				onClose={onModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div className="">{modalChild}</div>
			</Modal>
			<Backdrop
				sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
				open={open}
				onClick={handleClose}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</div>
	);
}

export default CalenderPage;
