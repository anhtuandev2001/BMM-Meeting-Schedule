// @ts-nocheck
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Modal from "@mui/material/Modal";
import Tooltip from "@mui/material/Tooltip";
import { signOut } from "firebase/auth";
import { useFormik } from "formik";
import React, { useRef, useState } from "react";
import { HiOutlineLogout } from "react-icons/hi";
import { toast } from "react-toastify";
import avatar from "../../assets/image/Avatar.jpg";
import { auth } from "../../firebase";
import useAuth from "../../utils/useAuth";
import { SignUpForm } from "./ModalProfile";

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	width: 400,
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
};

export function Profile() {
	const [anchorEl, setAnchorEl] = useState(null);
	const { currentUser } = useAuth();
	const open = Boolean(anchorEl);
	const menuRef = useRef(null);

	const [openModal, setOpenModal] = React.useState(false);
	const handleOpen = () => setOpenModal(true);
	const handleCloseModal = () => setOpenModal(false);
	const emailUser = currentUser?.email;

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

	const validate = (values) => {
		const errors = {};
		if (!values.firstName) {
			errors.firstName = "Required";
		} else if (values.firstName.length > 15) {
			errors.firstName = "Must be 15 characters or less";
		}

		if (!values.lastName) {
			errors.lastName = "Required";
		} else if (values.lastName.length > 20) {
			errors.lastName = "Must be 20 characters or less";
		}

		if (!values.email) {
			errors.email = "Required";
		} else if (
			!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email)
		) {
			errors.email = "Invalid email address";
		}

		return errors;
	};

	const formik = useFormik({
		initialValues: {
			firstName: "",
			lastName: "",
			email: "",
		},
		validate,
		onSubmit: (values) => {
			alert(JSON.stringify(values, null, 2));
		},
	});
	return (
		<React.Fragment>
			<Box
				sx={{
					display: "flex",
					alignItems: "center",
					textAlign: "center",
					padding: 0,
				}}>
				<Tooltip title="Account settings" sx={{ padding: 0 }}>
					<IconButton
						onClick={handleClick}
						size="small"
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						className="p-0"
						aria-expanded={open ? "true" : undefined}>
						<Avatar sx={{ width: 32, height: 32, padding: 0 }}>
							<img src={avatar} alt="avatar" />
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				ref={menuRef}
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
				<MenuItem>
					<button
						className="hover:bg-transparent flex items-center text-[#7A869A] font-nunito"
						onClick={handleOpen}>
						<Avatar /> My account
					</button>
				</MenuItem>
				<Modal
					open={openModal}
					onClose={handleCloseModal}
					aria-labelledby="modal-modal-title"
					aria-describedby="modal-modal-description">
					<Box sx={style}>
					<SignUpForm/>
					</Box>
				</Modal>
				<div>
					{currentUser ? (
						<MenuItem onClick={logout}>
							<ListItemIcon>
								<HiOutlineLogout />
							</ListItemIcon>
							Logout
						</MenuItem>
					) : (
						<div></div>
					)}
				</div>
			</Menu>
		</React.Fragment>
	);
}

export default Profile;
