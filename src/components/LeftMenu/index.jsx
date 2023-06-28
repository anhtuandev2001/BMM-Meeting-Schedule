import { useEffect, useRef, useState } from "react";
import { AiOutlineLeftCircle, AiOutlineRightCircle } from "react-icons/ai";
import { Link, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import IconLogo from "../../assets/icon/IconLogo";
import menuItems from "./MenuItems";

function LeftMenu() {
	const [isOpenMenu, setIsOpenMenu] = useState(true);
	const leftMenuRef = useRef(null);
	const location = useLocation();

	const handleToggleMenu = (event) => {
		event.stopPropagation();
		setIsOpenMenu((p) => !p);
	};

	useEffect(() => {
		window.addEventListener("resize", windowResize);
		windowResize();
		return () => {
			window.removeEventListener("resize", windowResize);
		};
	}, []);

	const windowResize = () => {
		setIsOpenMenu(window.innerWidth > 768);
	};

	return (
		<div>
			<menu
				ref={leftMenuRef}
				className={`pl-4 pt-6 md:pt-[80px] transition-[width] md:top-0 left-0 z-10 duration-300 group fixed md:sticky top-[56px]  bg-Neutral10-0 ${
					isOpenMenu ? "w-60" : "w-2"
				} min-h-[100vh] border-r`}>
				<button
					onClick={handleToggleMenu}
					className="text-RiverBed-0 group-hover:opacity-100 absolute opacity-0 right-0 top-20 bg-Neutral10-0 rounded-full translate-x-2/4">
					{isOpenMenu ? (
						<AiOutlineLeftCircle size="24px" />
					) : (
						<AiOutlineRightCircle size="24px" />
					)}
				</button>
				<div className="whitespace-nowrap overflow-hidden">
					<div className="pl-[2px] flex gap-2">
						<IconLogo />
						<div>
							<h3 className="font-bold text-RiverBed-0">Calendar</h3>
							<h4 className="text-[#6B778C] text-xs leading-5">
								Meeting Management
							</h4>
						</div>
					</div>
					<ul className="mt-4 mr-4">
						{menuItems.map((item) => (
							<li key={uuidv4()}>
								<Link
									to={item.to}
									className={`flex px-[10px] rounded-[3px] gap-4 items-center ${
										location.pathname === item.to
											? "text-[#0052CC] bg-NeutralAlpha-0"
											: "text-[#42526E]"
									}`}>
									{item.icon}
									<span className="leading-10 font-medium">{item.title}</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</menu>
		</div>
	);
}

export default LeftMenu;
