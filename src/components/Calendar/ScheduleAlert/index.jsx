// import { useDispatch } from "react-redux";

function ScheduleAlertPopup(action, title, message, payload, closeModal) {
	return (
		<div className="bg-white rounded-[3px] p-6 shadow my-2">
			<h3 className="font-medium text-xl mb-4">Delete</h3>
			<p className="font-normal text-sm mb-4">
				Are you sure to remove this schedule
			</p>
			<div className="flex justify-end">
				<button onClick={closeModal}>Discard</button>
				<button className="px-2 py-1 ml-3 text-sm text-white rounded-[3px] bg-[#DE350B]">
					Yes,{action} it
				</button>
			</div>
		</div>
	);
}

export default ScheduleAlertPopup;
