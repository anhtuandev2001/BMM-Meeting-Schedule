import IconNotification from "../../assets/icon/IconNotification";
import IconQuestion from "../../assets/icon/IconQuestion";
import IconMenu from "../../assets/icon/IconMenu";
import IconSetting from "../../assets/icon/IconSetting";
import Profile from "../Profile";

function Nav() {
	return (
		<nav className="flex justify-between py-3 items-center text-RiverBed-0">
			<div className="flex items-center gap-5">
				<button>
					<IconMenu />
				</button>
				<h1 className="text-h1 font-semibold uppercase">BLUEOC SOFTWARE</h1>
			</div>
			<div className="flex gap-[22px] items-center">
				<div className="flex gap-4 items-center">
					<IconNotification />
					<IconQuestion />
					<IconSetting />
				</div>
				<Profile />
			</div>
		</nav>
	);
}

export default Nav;
