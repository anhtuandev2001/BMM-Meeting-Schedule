// @ts-nocheck
import { useDispatch } from "react-redux";
import { getRoomList } from "../../store/slices/roomManagementSlice";
import { IoSearch } from "react-icons/io5";
import { Button } from "@mui/material";
function NonIdealState() {
	const dispatch = useDispatch();
	const handleReloadPage = () => {
		dispatch(getRoomList());
	};
	return (
		<div
			style={{
				margin: 100,
				padding: 10,
				textAlign: "center",
				fontWeight: "400",
				fontFamily: "Nunito, sans-serif",
				color: "black",
			}}>
			<br />
			<div
				style={{
					fontFamily: "Nunito, sans-serif",
				}}>
				<div>
					<span className="flex justify-center text-6xl text-gray-400 stroke-[2px] p-2">
						<IoSearch className="stroke-[2px]" />{" "}
					</span>
				</div>
				<div>
					<p className="text-xl font-bold text-slate-600">No search results</p>
					<div className="text-sm text-slate-500 mb-6">
						Please reload the page again.
					</div>
				</div>
				<Button onClick={handleReloadPage} variant="contained" size="small">
					Reload
				</Button>
			</div>
		</div>
	);
}
export default NonIdealState;
