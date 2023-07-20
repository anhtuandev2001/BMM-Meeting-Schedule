// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import Skeleton from "@mui/material/Skeleton";
import {
	EmailAuthProvider,
	reauthenticateWithCredential,
	signOut,
	updatePassword,
	updateProfile,
} from "firebase/auth";
import { useFormik } from "formik";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import * as Yup from "yup";
import IconCloseEye from "../../assets/icon/IconForm/IconCloseEye";
import IconOpenEye from "../../assets/icon/IconForm/IconOpenEye";
import IconRules from "../../assets/icon/IconForm/IconRules";
import { auth } from "../../firebase";
import useAuth from "../../utils/useAuth";
import { handleLoading } from "../../store/slices/loadingSlice";

function Information({ onCloseModal }) {
	const [checkCurrentPassword, setCheckCurrentPassword] = useState(false);
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [currentPassword, setCurrentPassword] = useState(false);
	const [skeletonLoading, setSkeletonLoading] = useState(true);
	const [confirmPassword, setConfirmPassword] = useState(false);
	const { currentUser } = useAuth();
	const [initialValues, setInitialValues] = useState({
		displayName: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const dispatch = useDispatch();
	const [displayName, setDisplayName] = useState("");
	const [email, setEmail] = useState("");

	const displayNameRef = useRef(null);
	const currentPasswordRef = useRef(null);
	const newPasswordRef = useRef(null);
	const confirmPasswordRef = useRef(null);
	const passwordRules = [
		"Be at least 6 characters",
		"	Have at least one number",
		"	Have at least one symbol",
		"	Have at least one uppercase letter",
		"	Have at least one lowercase letter",
	];
	const handleTabKeyPress = (e) => {
		if (e.key === "Tab") {
			e.preventDefault();
			switch (e.target.id) {
				case "displayName":
					currentPasswordRef.current?.focus();
					break;
				case "currentPassword":
					newPasswordRef.current?.focus();
					break;
				case "newPassword":
					confirmPasswordRef.current?.focus();
					break;
				case "confirmPassword":
					displayNameRef.current?.focus();
					break;
				default:
					break;
			}
		}
	};
	useEffect(() => {
		if (currentUser) {
			setDisplayName(currentUser?.displayName);
			setEmail(currentUser?.email);
			setInitialValues((pre) => ({
				...pre,
				displayName: currentUser?.displayName,
			}));
			setSkeletonLoading(false);
		}
	}, [currentUser]);
	const logout = async () => {
		await signOut(auth)
			.then(() => {})
			.catch(() => {});
	};
	useEffect(() => {
		if (isButtonLoading) {
			const timeout = setTimeout(() => {
				setIsButtonLoading(false);
			}, 3000);

			return () => {
				clearTimeout(timeout);
			};
		}
	}, [isButtonLoading]);
	const formik = useFormik({
		initialValues: initialValues,
		enableReinitialize: true,
		validateOnBlur: false,
		validationSchema: Yup.object({
			displayName: Yup.string()
				.max(15, "Must be 15 characters or less")
				.required("Required"),
			currentPassword: Yup.string().required("Required"),
			newPassword: Yup.string()
				.notOneOf(
					[Yup.ref("currentPassword")],
					"The new password is the same as the current password",
				)
				.min(6, "Password must be at least 6 characters")
				.matches(/(?=.*[0-9])/, "Password must contain at least one number")
				.matches(
					/(?=.*[!@#$%^&*])/,
					"Password must contain at least one symbol",
				)
				.matches(
					/(?=.*[A-Z])/,
					"Password must contain at least one uppercase letter",
				)
				.matches(
					/(?=.*[a-z])/,
					"Password must contain at least one lowercase letter",
				),
			confirmPassword: Yup.string().oneOf(
				[Yup.ref("newPassword"), null],
				"Passwords do must match",
			),
		}),
		onSubmit: (values) => {
			setIsButtonLoading(true);
			if (!isButtonLoading) {
				const { currentPassword, newPassword } = values;
				const credential = EmailAuthProvider.credential(
					currentUser.email,
					currentPassword,
				);
				reauthenticateWithCredential(currentUser, credential)
					.then(() => {
						setIsButtonLoading(false);
						setCheckCurrentPassword(false);
						if (newPassword) {
							updatePassword(currentUser, newPassword)
								.then(() => {
									toast.success("Change password successfully!");
									onCloseModal();
									dispatch(handleLoading(true));
									const timeOut = setTimeout(() => {
										dispatch(handleLoading(false));
										logout();
										clearTimeout(timeOut);
									}, 3000);
								})
								.catch(() => {
									toast.error("Password change failed!1");
								});
						}
						if (values.displayName !== displayName) {
							updateProfile(currentUser, { displayName: values.displayName })
								.then(() => {
									onCloseModal();
									toast.success("Change displayName successfully!");
								})
								.catch(() => {
									toast.error("displayName change failed!");
								});
						}
					})
					.catch(() => {
						setIsButtonLoading(false);
						setCheckCurrentPassword(true);
						toast.error("Password change failed!");
					});
			}
		},
	});
	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisible((prevState) => !prevState);
	}, []);

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setConfirmPassword((prevState) => !prevState);
	}, []);

	const toggleCurrentPasswordVisibility = useCallback(() => {
		setCurrentPassword((prevState) => !prevState);
	}, []);
	return (
		<form
			onSubmit={formik.handleSubmit}
			className="flex flex-col gap-3 justify-between h-full font-nunito text-[#172B4D] gap-y-[25px]">
			<div className="flex flex-col gap-3 gap-y-[25px]">
				<div className="flex relative">
					<label htmlFor="email" className="mr-2 font-bold">
						Email Address:
					</label>
					{skeletonLoading ? (
						<Skeleton sx={{ flex: 1 }} />
					) : (
						<span>{email}</span>
					)}
				</div>
				<div className="flex flex-col relative">
					<label htmlFor="displayName" className="mr-2 font-bold">
						Display Name:
					</label>
					<input
						ref={displayNameRef}
						onKeyDown={handleTabKeyPress}
						className="py-[10px] px-[8px] rounded-[3px] outline-none bg-[#f4f5f7] border mt-2"
						id="displayName"
						name="username"
						autoComplete="username"
						type="text"
						{...formik.getFieldProps("displayName")}
					/>
					{formik.touched.displayName && formik.errors.displayName ? (
						<div className="absolute bottom-[-20px] left-0 text-red-600">
							{formik.errors.displayName}
						</div>
					) : null}
				</div>
				<div className="flex flex-col relative">
					<label htmlFor="currentPassword" className="mr-2 font-bold">
						Current Password
					</label>
					<input
						ref={currentPasswordRef}
						onKeyDown={handleTabKeyPress}
						type={currentPassword ? "text" : "password"}
						autoComplete="password"
						className="flex-1 py-[10px] px-[8px] rounded-[3px] outline-none bg-[#f4f5f7] border mt-2"
						id="currentPassword"
						{...formik.getFieldProps("currentPassword")}
					/>
					<button
						type="button"
						className="absolute bottom-[10px] right-0 flex items-center pr-3"
						onClick={toggleCurrentPasswordVisibility}>
						{currentPassword ? <IconOpenEye /> : <IconCloseEye />}
					</button>
					{formik.touched.currentPassword && formik.errors.currentPassword ? (
						<div className="absolute bottom-[-20px] left-0 text-red-600">
							{formik.errors.currentPassword}
						</div>
					) : null}
					{checkCurrentPassword && (
						<div className="absolute bottom-[-20px] left-0 text-red-600">
							Wrong Password
						</div>
					)}
				</div>
				<div className="flex flex-col relative">
					<label
						htmlFor="newPassword"
						className="mr-2 font-bold flex items-center">
						New Password
						<div
							data-tooltip-target="tooltip-bottom"
							data-tooltip-placement="bottom"
							className=" ml-2  hover:cursor-pointer">
							<div className="group">
								<IconRules />
								<div
									className="absolute opacity-0 group-hover:opacity-100 text-xs bg-gray-800  text-white p-2 rounded-md transform translate-y-2 py-[15px] px-[15px]  pointer-events-none transition-opacity duration-200  z-10 "
									style={{ width: "fit-content" }}>
									<ul>
										{passwordRules.map((rule, index) => (
											<li key={index}>{rule} </li>
										))}
									</ul>
								</div>
							</div>
						</div>
					</label>
					<input
						ref={newPasswordRef}
						onKeyDown={handleTabKeyPress}
						autoComplete="new-password"
						className="flex-1 py-[10px] px-[8px] rounded-[3px] outline-none bg-[#f4f5f7] border mt-2"
						id="newPassword"
						type={passwordVisible ? "text" : "password"}
						{...formik.getFieldProps("newPassword")}
					/>
					<button
						type="button"
						className="absolute bottom-[10px] right-0 flex items-center pr-3"
						onClick={togglePasswordVisibility}>
						{passwordVisible ? <IconOpenEye /> : <IconCloseEye />}
					</button>
					{formik.touched.newPassword && formik.errors.newPassword ? (
						<div className="absolute bottom-[-20px] left-0 text-red-600">
							{formik.errors.newPassword}
						</div>
					) : null}
				</div>
				<div className="flex flex-col relative">
					<label htmlFor="confirmPassword" className="mr-2 font-bold">
						Confirm Password
					</label>
					<input
						ref={confirmPasswordRef}
						onKeyDown={handleTabKeyPress}
						className="flex-1 py-[10px] px-[8px] rounded-[3px] outline-none bg-[#f4f5f7] border mt-2"
						id="confirmPassword"
						autoComplete="confirm-password"
						type={confirmPassword ? "text" : "password"}
						{...formik.getFieldProps("confirmPassword")}
					/>
					<button
						type="button"
						className="absolute bottom-[10px] right-0 flex items-center pr-3"
						onClick={toggleConfirmPasswordVisibility}>
						{confirmPassword ? <IconOpenEye /> : <IconCloseEye />}
					</button>
					{formik.touched.confirmPassword && formik.errors.confirmPassword ? (
						<div className="absolute bottom-[-20px] left-0 text-red-600">
							{formik.errors.confirmPassword}
						</div>
					) : null}
				</div>
			</div>
			<div className="flex justify-between">
				<button className="btn text-[#42526E]" onClick={onCloseModal}>
					Discard
				</button>
				<LoadingButton
					variant="contained"
					sx={{
						textTransform: "capitalize",
					}}
					type="submit"
					loading={isButtonLoading}>
					Submit
				</LoadingButton>
			</div>
		</form>
	);
}

export default Information;
