// @ts-nocheck
import { TablePagination } from "@mui/material";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";

function TablePaginationRoomMeeting({
	roomsbooked,
	pageNumber,
	setPageNumber,
	pageSize,
	setPageSize,
}) {
	const { nonIdealStateStatus } = useSelector((state) => state.roomManagement);
	const handleChangePage = (event, newPageNumber) => {
		setPageNumber(newPageNumber);
	};

	const handleChangeRowsPerPage = (event) => {
		setPageSize(parseInt(event.target.value, 10));
		setPageNumber(0);
	};
	localStorage.setItem("pageSize", pageSize);
	const rowsPerPageOptions = [5, 15, 20, 50];
	const dataType = "Room";
	return (
		<TablePagination
			sx={{
				fontFamily: "Nunito",
				borderTop: "2px solid #dfe1e6",
				"& .MuiTablePagination-displayedRows": {
					fontFamily: "Nunito",
				},
				"& .MuiTablePagination-selectLabel": {
					fontFamily: "Nunito",
				},
			}}
			rowsPerPageOptions={rowsPerPageOptions}
			showFirstButton
			showLastButton
			component="div"
			count={nonIdealStateStatus ? 0 : roomsbooked && roomsbooked.length}
			page={pageNumber}
			onPageChange={handleChangePage}
			rowsPerPage={pageSize}
			onRowsPerPageChange={handleChangeRowsPerPage}
			labelDisplayedRows={({ from, to, count }) =>
				`${from}-${to} of ${
					count !== -1
						? `${count} ${pluralize(dataType, count)}`
						: `MORE THAN ${to}`
				}`
			}
		/>
	);
}

TablePaginationRoomMeeting.propTypes = {
	roomsbooked: PropTypes.array,
	pageNumber: PropTypes.number,
	setPageNumber: PropTypes.func.isRequired,
	pageSize: PropTypes.number,
	setPageSize: PropTypes.func.isRequired,
};

export default TablePaginationRoomMeeting;
