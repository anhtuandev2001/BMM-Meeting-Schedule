// @ts-nocheck
import { TablePagination } from "@mui/material";
import pluralize from "pluralize";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useTranslation } from "react-i18next";
function TablePaginationRoomMeeting({
	roomsBooked,
	pageNumber,
	setPageNumber,
	pageSize,
	setPageSize,
}) {
	const { t } = useTranslation();
	const { nonIdealStateStatus } = useSelector((state) => state.roomManagement);
	const handleChangePage = (event, newPageNumber) => {
		setPageNumber(newPageNumber);
	};

	const handleChangeRowsPerPage = (event) => {
		setPageSize(parseInt(event.target.value, 10));
		setPageNumber(0);
	};
	localStorage.setItem("pageSize", pageSize);
	const rowsPerPageOptions = [10, 25, 50, 100];
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
			count={nonIdealStateStatus ? 0 : roomsBooked && roomsBooked.length}
			page={pageNumber}
			onPageChange={handleChangePage}
			rowsPerPage={pageSize}
			labelRowsPerPage={t(`rows-per-page`)}
			onRowsPerPageChange={handleChangeRowsPerPage}
			labelDisplayedRows={({ from, to, count }) =>
				`${from}-${to} ${t(`of`)} ${
					count !== -1
						? `${count} ${t(pluralize(dataType, count).toLowerCase())}`
						: `MORE THAN ${to}`
				}`
			}
		/>
	);
}

TablePaginationRoomMeeting.propTypes = {
	roomsBooked: PropTypes.array,
	pageNumber: PropTypes.number,
	setPageNumber: PropTypes.func.isRequired,
	pageSize: PropTypes.number,
	setPageSize: PropTypes.func.isRequired,
};

export default TablePaginationRoomMeeting;
