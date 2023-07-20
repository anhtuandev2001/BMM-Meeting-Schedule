/* eslint-disable react-hooks/exhaustive-deps */
// @ts-nocheck
import { useEffect, useState } from "react";
import { TfiClose, TfiSearch } from "react-icons/tfi";
import { useDispatch, useSelector } from "react-redux";
import { setSearchListRoomsBooked } from "../../../store/slices/roomManagementSlice";
import UseDebounce from "../../../customHooks/UseDebounce";
import { useTranslation } from "react-i18next";

function TableSearch() {
	const { t } = useTranslation();
	const { roomsBooked, columns } = useSelector((state) => state.roomManagement);
	const dispatch = useDispatch();
	const [inputValue, setInputValue] = useState("");
	const inputValueDebounce = UseDebounce(inputValue, 300);
	const columnFields = columns.map((col) => col.field);
	const handleInputSearch = (event) => {
		setInputValue(event?.target.value);
	};
	const handleClearSearch = () => {
		setInputValue("");
	};
	useEffect(() => {
		const newRoomsBooked = roomsBooked?.filter((row) =>
			columnFields.some((columnField) => {
				return row[columnField]
					?.toString()
					.toLowerCase()
					.includes(inputValue.toString().toLowerCase().trim());
			}),
		);
		dispatch(setSearchListRoomsBooked(newRoomsBooked));
	}, [inputValueDebounce]);
	return (
		<div className="mb-1 focus">
			<form className="flex relative h-8">
				<input
					id="inputSearch"
					className="w-[300px] focus:outline-blue-500 px-6 rounded-lg border-[1px] border-gray-300 "
					type="text"
					placeholder={t("search")}
					value={inputValue}
					onChange={handleInputSearch}
				/>
				<div
					className="text-xs cursor-pointer absolute left-[275px] bottom-1/2 translate-y-1/2 rounded-xl hover:bg-gray-300 p-1"
					onClick={handleClearSearch}>
					<TfiClose />
				</div>
				<div className="text-xs absolute left-2 bottom-1/2 translate-y-1/2 rounded">
					<TfiSearch />
				</div>
			</form>
		</div>
	);
}
export default TableSearch;
