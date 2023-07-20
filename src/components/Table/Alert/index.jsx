// @ts-nocheck
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
	deleteMeetingRoom,
	lockMeetingRoom,
	setStatusOfRoom,
} from "../../../store/slices/roomManagementSlice";
import PropTypes from "prop-types";
import { FaSpinner } from "react-icons/fa";
import { Checkbox } from "@mui/material";
import { useTranslation } from "react-i18next";
function Alert({ action, payload, modalClose }) {
	const { t } = useTranslation();
	const [data, setData] = useState({
		title: "",
		message: "",
		buttonClass: "",
	});

	//loading submit form
	const { statusOfDialog } = useSelector((state) => state.roomManagement);
	// data handle
	useEffect(() => {
		if (action.toLowerCase() === "delete") {
			setData({
				title: `${t("delete")} ${payload?.name} ${t("room")}`,
				message: t("are-you-sure-to-delete-this-room"),
				buttonClass:
					"px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#DE350B]",
			});
		} else if (action.toLowerCase() === "lock") {
			setData({
				title: `${t("lock")} ${payload?.name} ${t("room")}`,
				message: t("the-room-will-be-locked"),
				buttonClass:
					"px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#0065FF]",
			});
			dispatch(setStatusOfRoom("Locked"));
		} else if (action.toLowerCase() === "unlock") {
			setData({
				title: `${t("unlock")} ${payload?.name} ${t("room")}`,
				message: t("the-room-will-be-unlocked"),
				buttonClass:
					"px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#0065FF]",
			});
			dispatch(setStatusOfRoom("Opening"));
		}
	}, [action]);

	//handle submit alert
	const dispatch = useDispatch();
	const handleSubmitAlert = async () => {
		if (action === "Delete") {
			await dispatch(deleteMeetingRoom(payload.id));
		}
		if (action === "Lock") {
			const dataLockRoom = {
				capacity: payload.capacity,
				colorId: payload.colorId,
				description: payload.description,
				devices: payload.devices,
				location: payload.location,
				name: payload.name,
				status: "Locked",
			};
			await dispatch(
				lockMeetingRoom({ id: payload.id, dataLockRoom: dataLockRoom }),
			);
		}
		if (action === "Unlock") {
			const dataLockRoom = {
				capacity: payload.capacity,
				colorId: payload.colorId,
				description: payload.description,
				devices: payload.devices,
				location: payload.location,
				name: payload.name,
				status: "Opening",
			};
			await dispatch(
				lockMeetingRoom({ id: payload.id, dataLockRoom: dataLockRoom }),
			);
		}
		modalClose();
		checked && localStorage.setItem("hideAlert", checked);
	};
	const hideAlert = localStorage.getItem("hideAlert");
	// check box
	const [checked, setChecked] = useState(false);
	const handleChange = (event) => {
		setChecked(event.target.checked);
	};
	useEffect(() => {
		if (!(hideAlert === null) && !(action === "Delete")) {
			handleSubmitAlert();
		}
	}, []);
	return !(hideAlert === null) && !(action === "Delete") ? (
		<></>
	) : (
		<div className="bg-white rounded-[3px] p-6 shadow my-2">
			<h3 className="font-medium text-xl mb-4">{data.title}</h3>
			<p className="font-normal text-sm mb-4">{data.message}</p>
			{action === "Delete" ? (
				""
			) : (
				<div>
					<Checkbox
						checked={checked}
						onChange={handleChange}
						inputProps={{ "aria-label": "controlled" }}
					/>
					<span>{t("don't ask me again")}</span>
				</div>
			)}
			<div className="flex justify-end">
				{statusOfDialog === "pending" ? (
					<button>{t("discard")}</button>
				) : (
					<button onClick={modalClose}>{t("discard")}</button>
				)}
				<button onClick={handleSubmitAlert} className={data.buttonClass}>
					{statusOfDialog === "pending" ? (
						<div className="relative">
							<span className="inline-block h-0 overflow-hidden invisible">
								{t(`Yes, ${action} it`)}
							</span>
							<span className="absolute top-1/2 right-1/2 translate-x-1/2 -translate-y-1/2">
								<FaSpinner className="animate-spin" />
							</span>
						</div>
					) : (
						t(`Yes, ${action} it`)
					)}
				</button>
			</div>
		</div>
	);
}

Alert.propTypes = {
	action: PropTypes.string,
	payload: PropTypes.object,
	modalClose: PropTypes.func.isRequired,
};

export default Alert;
