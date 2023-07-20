// @ts-nocheck
import { useDispatch } from "react-redux";
import Alert from "../Alert";
import MeetingRoomValidation from "../MeetingRoomValidation";
import PropTypes from "prop-types";
import { resetStatusOfDialog } from "../../../store/slices/roomManagementSlice";
import useAuth from "../../../utils/useAuth";
import { Tooltip } from "@mui/material";
import { FaEdit, FaTrashAlt, FaUnlock, FaLock } from "react-icons/fa";
import { useTranslation } from "react-i18next";
const TableAction = ({ row, onModalClose, onModalOpen }) => {
	const { t } = useTranslation();
	const { role } = useAuth();
	const dataTableActions = [
		{
			message: `Edit ${row?.name} Room`,
			action: "Update",
			content: <FaEdit className="text-lg" />,
		},
		{
			message: "",
			action: "Delete",
			content: <FaTrashAlt className="text-base" />,
		},
		{
			message: "",
			action: row && row.status === "Locked" ? t("unlock") : t("lock"),
			content:
				row && row.status === "Locked" ? (
					<FaUnlock className="text-base" />
				) : (
					<FaLock className="text-base" />
				),
		},
	];
	const upDateRoom = "Update";
	const dispatch = useDispatch();
	return (
		<div>
			<ul className="flex cursor-pointer ">
				{dataTableActions.map((dataTableAction, index) => {
					return (
						<div key={index}>
							{dataTableAction.action === upDateRoom ? (
								<li
									className={`${
										role === "admin"
											? "hover:bg-gray-300 text-[#172B4D] "
											: "cursor-default text-gray-400"
									} pr-1.5 pl-1.5 rounded`}
									onClick={() => {
										dispatch(resetStatusOfDialog("idle"));
										role === "admin" &&
											onModalOpen(
												<MeetingRoomValidation
													payload={row}
													message={dataTableAction.message}
													action={dataTableAction.action}
													modalClose={onModalClose}
												/>,
											);
									}}>
									{role === "admin" ? (
										dataTableAction.content
									) : (
										<Tooltip arrow={true} title={t("admin-message-default")}>
											<span>{dataTableAction.content}</span>
										</Tooltip>
									)}
								</li>
							) : (
								<li
									className={`${
										role === "admin"
											? "hover:bg-gray-300 text-[#172B4D] "
											: "cursor-default text-gray-400"
									} pr-1.5 pl-1.5 rounded`}
									onClick={() => {
										role === "admin" &&
											onModalOpen(
												<Alert
													action={dataTableAction.action}
													payload={row}
													modalClose={onModalClose}
												/>,
											);
									}}>
									{role === "admin" ? (
										dataTableAction.content
									) : (
										<Tooltip arrow={true} title={t("admin-message-default")}>
											<span>{dataTableAction.content}</span>
										</Tooltip>
									)}
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
