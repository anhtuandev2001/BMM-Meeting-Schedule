// @ts-nocheck
import { Button, Checkbox } from "@mui/material";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { dayList, filterDayList } from "../../../assets/enum/index";
import IconVectorLeft from "../../../assets/icon/IconVectorLeft";
import IconVectorRight from "../../../assets/icon/IconVectorRight";
import { checkboxFilterChange } from "../../../store/slices/ScheduleManagementSlice/filterCalendarSlice";
import { getRoomList } from "../../../store/slices/roomManagementSlice";
import CalendarSelect from "../CalendarSelect";
function CalendarFilters({ callbacks }) {
	const { t } = useTranslation();
	const [
		handleClickNextButton,
		handleClickPrevButton,
		handleClickToday,
		viewFileChange,
		currentYearMonth,
		currentWeek,
	] = callbacks;
	const dispatch = useDispatch();
	const { roomsBooked = [] } = useSelector((state) => state?.roomManagement);
	const [roomList, setRoomList] = useState([]);
	const { view } = useSelector((state) => state.filtersCalendar);
	const [showMenuFilter, setShowMenuFilter] = useState(false);

	useEffect(() => {
		dispatch(getRoomList());
	}, []);

	useEffect(() => {
		if (roomsBooked.length > 1) {
			const updatedList = roomsBooked.map((item) => {
				const name = item?.name;
				const id = item?.id;
				return { name, id };
			});
			setRoomList(updatedList);
		}
	}, [roomsBooked]);

	const handleChangeCheckbox = (e) => {
		const { checked } = e.target;
		dispatch(checkboxFilterChange(checked));
	};

	const handleClickFilter = () => {
		setShowMenuFilter((pre) => !pre);
	};

	const handleCloseMenu = () => {
		setShowMenuFilter(false);
	};

	return (
		<div className="flex flex-wrap gap-y-4 justify-between items-center relative">
			<div className="flex">
				<div
					className={`flex gap-2 gap-y-4 flex-col left-0 p-5 sm:p-0  sm:flex-row transition-transform sm:transition-none sm:translate-x-0 rounded-md shadow-[rgba(0,_0,_0,_0.24)_0px_3px_8px] sm:shadow-none items-center absolute sm:static top-0 ${
						showMenuFilter ? "translate-x-[0]" : "translate-x-[-140%]"
					}  bg-white z-[11]`}>
					<div className="flex flex-col sm:flex-row gap-4">
						<div className={` ${view == "day" ? "hidden" : ""} `}>
							<CalendarSelect list={filterDayList} typeSelect={"meeting"} />
						</div>
						<CalendarSelect list={roomList} typeSelect={"room"} />
						<button
							onClick={handleClickToday}
							className="bg-[#F4F5F7] capitalize py-[6px] px-4 text-[#42526E] font-medium rounded-[3px]">
							{t("today")}
						</button>
						<span className="text-lg text-[#42526E] font-medium flex flex-nowrap items-center">
							<span className="hidden lg:block">My event</span>
							<Checkbox
								color="primary"
								label="Only me"
								size="md"
								variant="soft"
								onChange={handleChangeCheckbox}
							/>
						</span>
					</div>
				</div>
				<span className="sm:hidden">
					<button
						className="bg-[#F4F5F7] text-[#7A869A] py-2 px-3 rounded-sm"
						onClick={handleClickFilter}>
						Filter
					</button>
				</span>
				<div className="items-center gap-2 gap-y-4 flex">
					<button className="text-[#42526E]" onClick={handleClickNextButton}>
						<IconVectorLeft />
					</button>
					<button className="text-[#42526E]" onClick={handleClickPrevButton}>
						<IconVectorRight />
					</button>
					<span className="text-lg text-[#42526E] font-medium">
						{viewFileChange === "week" ? currentWeek : currentYearMonth}
					</span>
				</div>
			</div>
			<CalendarSelect list={dayList} typeSelect={"view"} />
			{showMenuFilter && (
				<div
					className="fixed top-0 right-0 left-0 bottom-0  sm:hidden z-[10]"
					onClick={handleCloseMenu}></div>
			)}
		</div>
	);
}

export default CalendarFilters;
