// @ts-nocheck
import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { Link, useLocation } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import IconLogo from "../../assets/icon/IconLogo";
import { handleLeftMenu } from "../../store/slices/leftMenuSlice";
import menuItems from "./MenuItems";

function LeftMenu() {
	const { t } = useTranslation();
	const leftMenuRef = useRef(null);
	const location = useLocation();
	const { showMenu } = useSelector((state) => state?.leftMenu);
	const dispatch = useDispatch();

	useEffect(() => {
		window.addEventListener("resize", windowResize);
		windowResize();
		return () => {
			window.removeEventListener("resize", windowResize);
		};
	}, []);

	const windowResize = () => {
		dispatch(handleLeftMenu(window.innerWidth > 768));
	};

	const handleCloseModal = () => {
		dispatch(handleLeftMenu(false));
	};

	return (
		<div>
			<menu
				ref={leftMenuRef}
				className={`pl-4 pt-6 md:pt-[80px] transition-[width] md:top-0 left-0 z-[40] duration-300 group fixed md:sticky top-[56px]  bg-Neutral10-0 ${
					showMenu ? "w-60" : "w-2"
				} min-h-[100vh] border-r`}>
				<div className="whitespace-nowrap overflow-hidden">
					<div className="pl-[2px] flex gap-2">
						<span>
							<IconLogo />
						</span>
						<div>
							<h3 className="font-bold text-RiverBed-0">{t("calendar")}</h3>
							<h4 className="text-[#6B778C] text-xs leading-5">
								{t("meeting")} {t("management")}
							</h4>
						</div>
					</div>
					<ul className="mt-4 mr-4">
						{menuItems.map((item) => (
							<li key={uuidv4()}>
								<Link
									onClick={handleCloseModal}
									to={item.to}
									className={`flex px-[10px] rounded-[3px] gap-4 items-center ${
										location.pathname === item.to
											? "text-[#0052CC] bg-NeutralAlpha-0"
											: "text-[#42526E]"
									}`}>
									<span>{item.icon}</span>
									<span className="leading-10 font-medium">
										{t(item.title)}
									</span>
								</Link>
							</li>
						))}
					</ul>
				</div>
			</menu>
			{showMenu && (
				<div
					className="fixed top-0 right-0 left-0 bottom-0 z-[39] cursor-pointer"
					onClick={handleCloseModal}></div>
			)}
		</div>
	);
}

export default LeftMenu;
