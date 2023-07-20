// @ts-nocheck
import { TableSortLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
	setSortBy,
	setSortDirection,
} from "../../../store/slices/roomManagementSlice";
import { useTranslation } from "react-i18next";
const SortTable = ({ column }) => {
	const { t } = useTranslation();
	const dispatch = useDispatch();
	const { sortBy, sortDirection } = useSelector(
		(state) => state.roomManagement,
	);
	const handleRequestSort = (event, property) => {
		const isAscending = sortBy === property && sortDirection === "asc";
		dispatch(setSortBy(property));
		dispatch(setSortDirection(isAscending ? "desc" : "asc"));
	};
	return (
		<TableSortLabel
			active={sortBy === column.field}
			direction={sortBy === column.field ? sortDirection : "asc"}
			onClick={(event) => handleRequestSort(event, column.field)}>
			{column?.field == "id" ? "ID" : t(column.name.toLowerCase())}
		</TableSortLabel>
	);
};
export default SortTable;
