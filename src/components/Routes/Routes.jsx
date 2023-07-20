/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import { Navigate, Route, Routes } from "react-router-dom";

import {
	ErrorPage,
	LoginPage,
	MeetSchedule,
	RegisterPage,
	RoomManagement,
	Setting,
} from "../pages/index";

import App from "../../App";

import AuthRoute from "./AuthRoute";
import { selectLoading } from "../../store/slices/userSlice";
import { useSelector } from "react-redux";
import LoadingPage from "../pages/LoadingPage";
import useAuth from "../../utils/useAuth";
import ForgotPasswordPage from "../pages/ForgotPasswordPage";
const Routers = () => {
	const { loading } = useAuth();
	if (loading) {
		return <LoadingPage />;
	}
	return (
		<Routes>
			<Route
				path="/"
				element={
					<AuthRoute routeType="private">
						<App />
					</AuthRoute>
				}>
				<Route path="/" element={<Navigate to="/room" replace={true} />} />
				<Route path="room" element={<RoomManagement />} />
				<Route path="schedule" element={<MeetSchedule />} />
				<Route path="settings" element={<Setting />} />
				<Route path="*" element={<ErrorPage />} />
			</Route>

			<Route
				path="/login"
				element={
					<AuthRoute routeType="public">
						<LoginPage />
					</AuthRoute>
				}
			/>

			<Route
				path="/register"
				element={
					<AuthRoute routeType="public">
						<RegisterPage />
					</AuthRoute>
				}
			/>
			<Route
				path="/forgot-password"
				element={
					<AuthRoute routeType="public">
						<ForgotPasswordPage />
					</AuthRoute>
				}
			/>
		</Routes>
	);
};

export default Routers;
