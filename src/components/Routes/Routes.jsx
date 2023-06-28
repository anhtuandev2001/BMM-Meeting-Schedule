import { Route, Routes, useNavigate } from "react-router-dom";

import {
	Alo,
	ErrorPage,
	LoginPage,
	MeetSchedule,
	RegisterPage,
	RoomManagement,
	Setting,
} from "../pages/index";

import App from "../../App";

import { useEffect } from "react";
import { useSelector } from "react-redux";
import { selectLoading } from "../../store/slices/userSlice";
import LoadingPage from "../pages/LoadingPage";
import PrivateRoute from "./PrivateRoute";
import PublicRoute from "./PublicRoute";
import SuperRoute from "./SuperRoute";

const Routers = () => {
	const isLoading = useSelector(selectLoading);
	const navigate = useNavigate(); // Di chuyển gọi useNavigate ra khỏi điều kiện

	useEffect(() => {
		if (window.location.pathname === "/") {
			navigate("/room");
		}
	}, [navigate]);

	if (isLoading) {
		return <LoadingPage />;
	}

	return (
		<Routes>
			<Route
				path="/"
				element={
					<PrivateRoute>
						<App />
					</PrivateRoute>
				}>
				<Route path="room" element={<RoomManagement />} />
				<Route path="schedule" element={<MeetSchedule />} />
				<Route path="settings" element={<Setting />} />
				<Route path="*" element={<ErrorPage />} />
			</Route>
			<Route
				path="/alo"
				element={
					<SuperRoute>
						<Alo />
					</SuperRoute>
				}
			/>
			<Route
				path="/login"
				element={
					<PublicRoute>
						<LoginPage />
					</PublicRoute>
				}
			/>
			<Route
				path="/register"
				element={
					<PublicRoute>
						<RegisterPage />
					</PublicRoute>
				}
			/>
		</Routes>
	);
};

export default Routers;
