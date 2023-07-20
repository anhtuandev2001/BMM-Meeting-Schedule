import { Outlet } from "react-router-dom";
import LeftMenu from "../LeftMenu";

function LayOut() {
	return (
		<main className="flex">
			<LeftMenu />
			<div className="flex-1 pl-5 md:pl-0 pt-14 overflow-scroll">
				<Outlet />
			</div>
		</main>
	);
}

export default LayOut;
