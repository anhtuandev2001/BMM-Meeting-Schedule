// @ts-nocheck
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import {
	deleteMeetingRoom,
	lockMeetingRoom,
	setStatusOfRoom,
} from "../../store/slices/roomManagementSlice";
import PropTypes from "prop-types";

function Alert({ action, payload, modalClose }) {
	const [data, setData] = useState({
		title: "",
		message: "",
		buttonClass: "",
	});
	// data handle
	useEffect(() => {
		if (action.toLowerCase() === "delete") {
			setData({
				title: "Delete Cali room",
				message: "Lock This RoomAre you sure to delete this room?",
				buttonClass:
					"px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#DE350B]",
			});
		} else if (action.toLowerCase() === "lock") {
			setData({
				title: "Lock this room",
				message:
					"The room will be locked and we will cannot create a meeting on it. Are you sure?",
				buttonClass:
					"px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#0065FF]",
			});
			dispatch(setStatusOfRoom("Locked"));
		} else if (action.toLowerCase() === "unlock") {
			setData({
				title: "Unlock this room",
				message:
					"The room will be unlocked and we will can create a meeting on it. Are you sure?",
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
			dispatch(deleteMeetingRoom(payload.id));
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
			dispatch(lockMeetingRoom({ id: payload.id, dataLockRoom: dataLockRoom }));
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
			dispatch(lockMeetingRoom({ id: payload.id, dataLockRoom: dataLockRoom }));
		}
		await setTimeout(() => {
			modalClose();
		}, 300);
	};
	return (
		<div className="bg-white rounded-[3px] p-6 shadow my-2">
			<h3 className="font-medium text-xl mb-4">{data.title}</h3>
			<p className="font-normal text-sm mb-4">{data.message}</p>
			<div className="flex justify-end">
				<button onClick={modalClose}>Discard</button>
				<button onClick={handleSubmitAlert} className={data.buttonClass}>
					Yes, {action} it
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
