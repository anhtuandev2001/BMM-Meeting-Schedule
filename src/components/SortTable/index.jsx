// @ts-nocheck
import { TableSortLabel } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setSortBy, setSortDirection } from "../../store/slices/roomManagementSlice";

const sortedRowInformation = (rowArray, comparator) => {
    const stabilizedRowArray = rowArray.map((el, index) => [el, index]);
    stabilizedRowArray.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order;
        }
        return a[1] - b[1];
    });
    return stabilizedRowArray.map((el) => el[0]);
};

function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
        return -1;
    }
    if (b[orderBy] > a[orderBy]) {
        return 1;
    }
    return 0;
}
const getComparator = (order, orderBy) => {
    return order === "desc"
        ? (a, b) => descendingComparator(a, b, orderBy)
        : (a, b) => -descendingComparator(a, b, orderBy);
}

const SortTable = ({column}) => {
    const dispatch = useDispatch();
    const {sortBy, sortDirection} = useSelector((state) => state.roomManagement)
	const handleRequestSort = (event, property) => {
		const isAscending = sortBy === property && sortDirection === "asc";
		dispatch(setSortBy(property));
		dispatch(setSortDirection(isAscending ? "desc" : "asc"));
	};

	// end table sort
	return (
			<TableSortLabel
				active={sortBy === column.field}
				direction={sortBy === column.field ? sortDirection : "asc"}
				onClick={(event) => handleRequestSort(event, column.field)}>
				{column.name}
			</TableSortLabel>
	);
};
export {sortedRowInformation, getComparator}
export default SortTable;
