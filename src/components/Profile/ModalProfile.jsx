// @ts-nocheck
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import PropTypes from "prop-types";
import * as React from "react";
import ChangeAvatar from "./ChangeAvatar";
import Information from "./ChangeInformation";

function CustomTabPanel(props) {
	const { children, value, index, ...other } = props;

	return (
		<div
			className="flex-1"
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			{...other}>
			{value === index && <Box sx={{ p: 3, height: "100%" }}>{children}</Box>}
		</div>
	);
}

CustomTabPanel.propTypes = {
	children: PropTypes.node,
	index: PropTypes.number.isRequired,
	value: PropTypes.number.isRequired,
};

function a11yProps(index) {
	return {
		id: `simple-tab-${index}`,
		"aria-controls": `simple-tabpanel-${index}`,
	};
}

const style = {
	position: "absolute",
	top: "50%",
	left: "50%",
	transform: "translate(-50%, -50%)",
	bgcolor: "background.paper",
	boxShadow: 24,
	p: 4,
	height: "90%",
	display: "flex",
	flexDirection: "column",
};

export default function BasicModal(props) {
	const { onCloseModal, openModalProfile } = props;
	const [value, setValue] = React.useState(0);

	const handleChange = (_, newValue) => {
		setValue(newValue);
	};

	return (
		<div className="h-full w-full rounded-sm">
			<Modal
				open={openModalProfile}
				onClose={onCloseModal}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description">
				<Box sx={style} className="rounded w-full sm:w-[600px]">
					<Box sx={{ borderBottom: 1, borderColor: "divider" }}>
						<Tabs
							value={value}
							onChange={handleChange}
							aria-label="basic tabs example">
							<Tab label="Information" {...a11yProps(0)} />
							<Tab label="Avatar" {...a11yProps(1)} />
						</Tabs>
					</Box>
					<CustomTabPanel value={value} index={0}>
						<Information onCloseModal={onCloseModal} />
					</CustomTabPanel>
					<CustomTabPanel value={value} index={1}>
						<ChangeAvatar onCloseModal={onCloseModal} />
					</CustomTabPanel>
				</Box>
			</Modal>
		</div>
	);
}
