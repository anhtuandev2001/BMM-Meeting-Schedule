// @ts-nocheck
import Alert from "../Alert";
import MeetingRoomValidation from "../meetingRoomValidation";
import PropTypes from "prop-types";

const TableAction = ({ row, onModalClose, onModalOpen }) => {
	const dataTableActions = [
		{ message: "Edit Cali Room", action: "Update" },
		{ message: "", action: "Delete" },
		{ message: "", action: row && row.status === "Locked" ? "Unlock" : "Lock" },
	];
	const upDateRoom = "Update";
	return (
		<div>
			<ul className="flex cursor-pointer ">
				{dataTableActions.map((dataTableAction, index) => {
					return (
						<div key={index}>
							{dataTableAction.action === upDateRoom ? (
								<li
									className=" hover:bg-gray-300 pr-0.5 rounded"
									onClick={() => {
										onModalOpen(
											<MeetingRoomValidation
												payload={row}
												message={dataTableAction.message}
												action={dataTableAction.action}
												modalClose={onModalClose}
											/>,
										);
									}}>
									{dataTableAction.action}
								</li>
							) : (
								<li
									className="hover:bg-gray-300 rounded px-0.5"
									onClick={() => {
										onModalOpen(
											<Alert
												action={dataTableAction.action}
												payload={row}
												modalClose={onModalClose}
											/>,
										);
									}}>
									{dataTableAction.action}
								</li>
							)}
						</div>
					);
				})}
			</ul>
		</div>
	);
};
TableAction.propTypes = {
	row: PropTypes.object,
	onModalClose: PropTypes.func.isRequired,
	onModalOpen: PropTypes.func.isRequired,
};
export default TableAction;
