// @ts-nocheck
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { dayList, filterDayList } from "../../../assets/enum/index";
import IconVectorLeft from "../../../assets/icon/IconVectorLeft";
import IconVectorRight from "../../../assets/icon/IconVectorRight";
import { getRoomList } from "../../../store/slices/roomManagementSlice";
import CalendarSelect from "../CalendarSelect";

function CalendarFilters({ callbacks }) {
	const [
		handleClickNextButton,
		handleClickPrevButton,
		handleClickToday,
		viewFileChange,
		currentYearMonth,
		currentWeek,
	] = callbacks;
	const dispatch = useDispatch();
	const { roomsbooked = [] } = useSelector((state) => state?.roomManagement);
	const [roomList, setRoomList] = useState([]);
	const { view } = useSelector((state) => state.filtersCalendar);

	useEffect(() => {
		dispatch(getRoomList());
	}, []);

	useEffect(() => {
		if (roomsbooked.length > 1) {
			const updatedList = roomsbooked.map((item) => {
				const name = item?.name;
				const id = item?.id;
				return { name, id };
			});
			setRoomList(updatedList);
		}
	}, [roomsbooked]);

	return (
		<div className="flex flex-wrap gap-y-4 justify-between items-center">
			<div className="flex gap-2 gap-y-4 flex-wrap items-center">
				<div className="flex flex-wrap gap-4">
					<div className={` ${view == "day" ? "hidden" : ""} `}>
						<CalendarSelect list={filterDayList} typeSelect={"meeting"} />
					</div>
					<CalendarSelect list={roomList} typeSelect={"room"} />
					<button
						onClick={handleClickToday}
						className="bg-[#F4F5F7] py-[6px] px-4 text-[#42526E] font-medium rounded-[3px]">
						Today
					</button>
				</div>
				<div className="items-center gap-2 gap-y-4 flex-wrap flex">
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
		</div>
	);
}

export default CalendarFilters;
