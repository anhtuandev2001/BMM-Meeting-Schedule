// @ts-nocheck
import { Button } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import IconMenu from "../../assets/icon/IconMenu";
import IconNotification from "../../assets/icon/IconNotification";
import IconQuestion from "../../assets/icon/IconQuestion";
import IconSetting from "../../assets/icon/IconSetting";
import logo from "../../assets/icon/logoBlueOC.png";
import { handleLeftMenu } from "../../store/slices/leftMenuSlice";
import Profile from "../Profile";
import Translation from "../Translation";
import { useEffect, useState } from "react";

function Nav() {
	const { t } = useTranslation();
	const { showMenu } = useSelector((state) => state?.leftMenu);
	const dispatch = useDispatch();
	useEffect(() => {
		if (showMenu) {
			document.body.style.overflow = "hidden";
		} else {
			document.body.style.overflow = "auto";
		}
		return () => {
			document.body.style.overflow = "auto";
		};
	}, [showMenu]);

	const handleToggleMenu = (event) => {
		event.stopPropagation();
		dispatch(handleLeftMenu(!showMenu));
	};
	return (
		<nav className="flex justify-between py-3 items-center text-RiverBed-0">
			<div className="flex items-center gap-2">
				<Button
					sx={{
						minWidth: 20,
					}}
					onClick={handleToggleMenu}>
					<IconMenu />
				</Button>
				<h1 className="text-h1 font-semibold uppercase hidden sm:block">
					BLUEOC {t("software-logo")}
				</h1>
				<span className="sm:hidden">
					<img src={logo} alt="logo" className="h-[30px]" />
				</span>
			</div>
			<div className="flex sm:gap-[22px] items-center">
				<div className="flex gap-4 items-center">
					<Translation />
					<span className="hidden sm:block">
						<IconNotification />
					</span>
					<span className="hidden sm:block">
						<IconQuestion />
					</span>
					<span className="hidden sm:block">
						<IconSetting />
					</span>
				</div>
				<Profile />
			</div>
		</nav>
	);
}

export default Nav;
