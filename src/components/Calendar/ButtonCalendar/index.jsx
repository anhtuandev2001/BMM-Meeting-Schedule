import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import PropTypes from "prop-types";
import * as React from "react";
import CalendarScheduleForm from "../CalendarScheduleForm";
import IconMore from "../../../assets/icon/IconMore";

function ButtonCalendar({ onModalOpen, onModalClose }) {
	const [anchorEl, setAnchorEl] = React.useState(null);
	const open = Boolean(anchorEl);
	const handleClick = (event) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};
	return (
		<React.Fragment>
			<Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
				<Tooltip title="More">
					<IconButton
						onClick={handleClick}
						size="small"
						aria-controls={open ? "account-menu" : undefined}
						aria-haspopup="true"
						sx={{
							borderRadius: 1,
							padding: 0,
						}}
						aria-expanded={open ? "true" : undefined}>
						<Avatar
							sx={{
								width: 32,
								borderRadius: "3px",
								background: "#F4F5F7",
								height: 32,
							}}>
							<IconMore />
						</Avatar>
					</IconButton>
				</Tooltip>
			</Box>
			<Menu
				anchorEl={anchorEl}
				id="account-menu"
				open={open}
				onClose={handleClose}
				onClick={handleClose}
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
				<MenuItem onClick={handleClose}>
					<button
						onClick={() =>
							onModalOpen(
								<CalendarScheduleForm
									payload={null}
									action={"Create"}
									onModalClose={onModalClose}
								/>,
							)
						}
						className="bg-[#0052CC] text-white py-2 px-3 rounded-[3px]">
						Create Schedule
					</button>
				</MenuItem>
			</Menu>
		</React.Fragment>
	);
}

ButtonCalendar.propTypes = {
	onModalOpen: PropTypes.func.isRequired,
	onModalClose: PropTypes.func.isRequired,
};

export default ButtonCalendar;
