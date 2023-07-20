// @ts-nocheck
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import { MdAccountCircle } from "react-icons/md";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "firebase/auth";
import { getDownloadURL, ref } from "firebase/storage";
import * as React from "react";
import { useEffect, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { toast } from "react-toastify";
import { auth, storage } from "../../firebase";
import useAuth from "../../utils/useAuth";
import BasicModal from "./ModalProfile";
import { useDispatch, useSelector } from "react-redux";
import { handleAvatarUrl } from "../../store/slices/avatarUrl";
import avatar from "../../assets/image/avatar.webp";
import { useTranslation } from "react-i18next";

export function Profile() {
	const { url = "" } = useSelector((state) => state?.avatarUrl);
	const { t } = useTranslation();
	const [anchorEl, setAnchorEl] = React.useState(null);
	const [openModalProfile, setOpenModalProfile] = useState(false);
	const dispatch = useDispatch();
	const { currentUser } = useAuth();
	const open = Boolean(anchorEl);
	const logout = async () => {
		await signOut(auth)
			.then(() => {
				localStorage.removeItem("activeMenu");
			})
			.catch((err) => {
				toast.error(err.message);
			});
	};
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	const handleOpenProfile = () => setOpenModalProfile(true);
	const handleCloseProfile = () => setOpenModalProfile(false);

	useEffect(() => {
		if (currentUser) {
			const userId = currentUser?.uid;
			const storageRef = ref(storage, `users/${userId}/avatar.jpg`);
			getDownloadURL(storageRef).then((url) => {
				dispatch(handleAvatarUrl(url));
			});
		}
	}, [currentUser]);

	return (
		<div>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					padding: 0,
				}}>
				<Tooltip title={t("account-settings")} sx={{ padding: 0 }}>
					<IconButton
						onClick={handleClick}
						size="small"
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						className="p-0"
						aria-expanded={open ? "true" : undefined}>
						<Avatar sx={{ width: 32, height: 32, padding: 0 }}>
							<img src={url ? url : avatar} alt="avatar" />
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				PaperProps={{
					elevation: 0,
					sx: {
						overflow: "visible",
						filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
						mt: 1.5,
						"& .MuiMenuItem-root": {
							fontFamily: "nunito",
							color: "#42526E",
							textAlign: "right",
							width: "100%",
						},
						"& .MuiAvatar-root": {
							width: 32,
							height: 32,
							ml: -0.5,
							mr: 1,
						},
						"&:before": {
							content: '""',
							display: "block",
							position: "absolute",
							top: 0,
							right: 14,
							width: 10,
							height: 10,
							bgcolor: "background.paper",
							transform: "translateY(-50%) rotate(45deg)",
							zIndex: 0,
						},
					},
				}}
				transformOrigin={{ horizontal: "right", vertical: "top" }}
				anchorOrigin={{ horizontal: "right", vertical: "bottom" }}>
				<MenuItem
					sx={{
						padding: "0",
					}}
					onClick={handleClose}>
					<button
						onClick={handleOpenProfile}
						className="h-full w-full py-2 flex items-center px-3 gap-2">
						<MdAccountCircle size={24} />
						Account
					</button>
				</MenuItem>
				<Divider />
				<div>
					{currentUser ? (
						<MenuItem onClick={logout}>
							<ListItemIcon>
								<HiOutlineLogout />
							</ListItemIcon>
							{t("logout")}
						</MenuItem>
					) : (
						<div></div>
					)}
				</div>
			</Menu>
			<BasicModal
				onClose={handleClose}
				onCloseModal={handleCloseProfile}
				onOpenModal={handleOpenProfile}
				openModalProfile={openModalProfile}
			/>
		</div>
	);
}

export default Profile;
