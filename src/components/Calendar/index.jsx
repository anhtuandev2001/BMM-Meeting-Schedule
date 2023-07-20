/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import { Modal } from "@mui/material";
import "@toast-ui/calendar/dist/toastui-calendar.min.css";
import Calendar from "@toast-ui/react-calendar";
import { useEffect, useRef, useState } from "react";
import { BsFillSendFill } from "react-icons/bs";
import { FaServer } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { handleFinalScheduleList } from "../../store/slices/ScheduleManagementSlice/ScheduleManagementSlice";
import {
	getColorSelection,
	getScheduleList,
	updateScheduleOnDrag,
} from "../../store/slices/ScheduleManagementSlice/ScheduleReduce";
import { handleLoading } from "../../store/slices/loadingSlice";
import ScheduleInfoPopup from "../Calendar/ScheduleInfoPopup";
import ButtonCalendar from "./ButtonCalendar";
import CalendarFilters from "./CalendarFilters";
import CalendarScheduleForm from "./CalendarScheduleForm";
import { scheduleListRemainingSelector } from "./selector";
import { DateTime } from "luxon";
import { useTranslation } from "react-i18next";
export function CalenderPage() {
	const { t } = useTranslation();
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
	const [isGetScheduleListFalse, setIsGetScheduleListFalse] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const [isModalShow, setIsModalShow] = useState(false);
	const [modalChild, setModalChild] = useState(null);
	const [currentYearMonth, setCurrentYearMonth] = useState("");
	const [currentWeek, setCurrentWeek] = useState("");
	const dispatch = useDispatch();
	const calendarRef = useRef();

	useEffect(() => {
		dispatch(handleLoading(false));
	}, [finalScheduleList]);

	useEffect(() => {
		dispatch(handleLoading(true));
		dispatch(getColorSelection());
		dispatch(getScheduleList());
	}, [dispatch, createSchedule, updateSchedule, deleteSchedule]);

	useEffect(() => {
		if (
			status.scheduleColorInfo == "success" &&
			status.scheduleListInfo == "success"
		) {
			dispatch(handleLoading(false));
			dispatch(handleFinalScheduleList({ ScheduleList, colorSelection }));
		} else if (
			status.scheduleColorInfo == "error" ||
			status.scheduleListInfo == "error"
		) {
			dispatch(handleLoading(false));
			setIsLoading(false);
			setIsGetScheduleListFalse(true);
		}
	}, [ScheduleList, colorSelection]);

	const onOpenModal = (modalChild) => {
		setModalChild(modalChild);
		setIsModalShow(true);
	};
	const onModalClose = () => {
		setIsModalShow(false);
	};

	const onBeforeUpdateEvent = (e) => {
		dispatch(handleLoading(true));
		dispatch(updateScheduleOnDrag(e));
	};
	const handleBeforeCreateEvent = (e) => {
		const time = {
			start: DateTime.fromJSDate(e.start).toString().slice(0, 16),
			end: DateTime.fromJSDate(e.end).toString().slice(0, 16),
		};
		onOpenModal(
			<CalendarScheduleForm
				payload={null}
				action="create"
				onCloseModal={onModalClose}
				time={time}
			/>,
		);
	};
	const onClickEvent = (event) => {
		onOpenModal(
			<ScheduleInfoPopup payload={event.event} onCloseModal={onModalClose} />,
		);
	};

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [viewFileChange]);

	return (
		<div className="pt-4 px-4 calendar-container">
			<div className="flex flex-col flex-wrap gap-[10px] mb-4">
				<div className="flex flex-wrap gap-2 text-[#6B778C]">
					<span>{t("calendar")}</span>
					<span>/</span>
					<span>{t("meeting-schedule")}</span>
				</div>
				<div className="flex flex-wrap justify-between">
					<div>
						<h2 className="font-medium text-xl">{t("meeting-schedule")}</h2>
					</div>
					<div>
						<ButtonCalendar
							onModalOpen={onOpenModal}
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
						<h2 className="text-4xl my-4">{t("no-response")}</h2>
						<LoadingButton
							size="small"
							onClick={() => {
								dispatch(getColorSelection());
								dispatch(getScheduleList());
								setIsLoading(true);
							}}
							endIcon={<BsFillSendFill />}
							loading={isLoading}
							loadingPosition="end"
							variant="contained">
							<span>{t("try-again")}</span>
						</LoadingButton>
					</div>
				</div>
			) : (
				<div className="overflow-scroll h-[calc(100vh-210px)]">
					<Calendar
						height="900px"
						view={viewFileChange}
						week={{
							dayNames: [
								t("sunday"),
								t("monday"),
								t("tuesday"),
								t("wednesday"),
								t("thursday"),
								t("friday"),
								t("saturday"),
							],
						}}
						month={{
							dayNames: [
								t("sunday"),
								t("monday"),
								t("tuesday"),
								t("wednesday"),
								t("thursday"),
								t("friday"),
								t("saturday"),
							],
						}}
						ref={calendarRef}
						events={finalScheduleList}
						onClickEvent={onClickEvent}
						onBeforeUpdateEvent={onBeforeUpdateEvent}
						onSelectDateTime={handleBeforeCreateEvent}
					/>
				</div>
			)}
			<Modal
				open={isModalShow}
				onClose={onModalClose}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<div className="">{modalChild}</div>
			</Modal>
		</div>
	);
}

export default CalenderPage;
