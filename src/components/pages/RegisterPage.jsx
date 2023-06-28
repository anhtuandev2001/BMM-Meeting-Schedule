// @ts-nocheck
import { signOut } from "firebase/auth";
import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { validator } from "../../utils/validator";
// @ts-ignore
import logo from "../../assets/icon/logoBlueOC.png";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { db } from "../../firebase";
import { auth } from "../../firebase";
import { updateProfile } from "firebase/auth";
import { toast } from "react-toastify";
import LoadingPage from "./LoadingPage";
import IconCloseEye from "../../assets/icon/IconForm/IconCloseEye";
import IconOpenEye from "../../assets/icon/IconForm/IconOpenEye";
import IconRules from "../../assets/icon/IconForm/IconRules";
import { useDispatch, useSelector } from "react-redux";
import { setUser, setLoading } from "../../store/slices/userSlice";
import { setError, clearError } from "../../store/slices/errorSlice";
const RegisterPage = () => {
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const user = useSelector((state) => state.user);

	const error = useSelector((state) => state.error);
	const [errConfirmPassword, setErrConfirmPassword] = useState("");
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [confirmPassword, setConfirmPassword] = useState(false);
	const [inputError, setInputError] = useState(false);

	const passwordRules = [
		"Be at least 6 characters",
		"	Have at least one number",
		"	Have at least one symbol",
		"	Have at least one uppercase letter",
		"	Have at least one lowercase letter",
	];

	const handleInputChange = useCallback(
		(event) => {
			const { name, value } = event.target;
			dispatch(
				setUser({
					...user,
					[name]: value ?? user[name], // Using nullish coalescing operator
				}),
			);
		},
		[dispatch, user],
	);

	const handleSubmit = useCallback(
		async (event) => {
			event.preventDefault();
			const { email, password, username, confirmPassword } = user;
			let isValid = true;

			const handleValidationError = (info, errorMessage) => {
				setTimeout(() => {
					dispatch(clearError());
				}, 5000);

				dispatch(
					setError({
						[info]: errorMessage,
					}),
				);
				setInputError(true);
				isValid = false;
			};

			validator.validate(["username"], username, () => {
				handleValidationError(
					"username",
					"Username should be 3-16 characters and shouldn't include any special character!",
				);
			});

			validator.validate(["password"], password, () => {
				if (password.length < 6) {
					handleValidationError(
						"password",
						"Password should be at least 6 characters long",
					);
				} else {
					handleValidationError(
						"password",
						"Password should include at least 1 letter, 1 number, and 1 special character",
					);
				}
			});

			validator.validate(["email"], email, () => {
				handleValidationError("email", "It should be a valid email address!");
			});
			validator.validate(["empty"], email, () => {
				handleValidationError("email", "Please fill in your email");
			});
			validator.validate(["empty"], confirmPassword, () => {
				handleValidationError(
					"confirmPassword",
					"Please fill in your confirm password",
				);
			});
			validator.validate(["empty"], username, () => {
				handleValidationError("username", "Please fill in your name");
			});
			validator.validate(["empty"], password, () => {
				handleValidationError("password", "Please fill in your password");
			});

			if (confirmPassword === "" || user.password !== confirmPassword) {
				setErrConfirmPassword(
					confirmPassword === ""
						? "Please fill in your confirm password"
						: "Password do not match",
				);
				isValid = false;
				setTimeout(() => {
					setErrConfirmPassword("");
				}, 5000);
			}

			if (
				email === "" ||
				username === "" ||
				password === "" ||
				confirmPassword === "" ||
				password !== confirmPassword ||
				error.email ||
				error.username ||
				error.password ||
				error.confirmPassword
			) {
				isValid = false;
			}
			if (!isValid) {
				return;
			}

			try {
				dispatch(setLoading(true));
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					user.email,
					user.password,
				);
				const users = userCredential.user;
				const userId = users.uid;
				const displayName = user.username;

				// I was create a new document reference with the generated ID in the "users" collection
				const userDocRef = doc(db, "users", userId);

				await updateProfile(users, {
					displayName: user.username,
				});
				// Set the user data in the document
				await setDoc(userDocRef, {
					uid: userId,
					email: email,
					role: "user",
					displayName: displayName,
					createdAt: serverTimestamp(),
				});
				dispatch(setLoading(false));
				await signOut(auth);
				toast.success("Successful create account !");
				navigate("/login");
			} catch (error) {
				const errorCode = error.code;
				const errorMessage = error.message;
				if (errorCode === "auth/weak-password") {
					handleValidationError(
						"password",
						"The password should be at least 6 characters long",
					);
				} else if (errorCode === "auth/email-already-in-use") {
					handleValidationError(
						"email",
						"This email address is already in use. Please use a different email.",
					);
				} else {
					console.log(errorMessage);
				}
			} finally {
				dispatch(setLoading(false));
			}
		},
		[
			navigate,
			user,
			error,
			setError,
			setErrConfirmPassword,
			setInputError,
			confirmPassword,
			dispatch,
		],
	);
	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisible((prevState) => !prevState);
	}, []);

	const toggleConfirmPasswordVisibility = useCallback(() => {
		setConfirmPassword((prevState) => !prevState);
	}, []);
	return (
		<>
			<div className="bg-login ">
				{user.loading ? (
					<LoadingPage />
				) : (
					<div className=" container-small flex flex-col justify-center items-center h-full">
						<div>
							<div className="form w-full bg-gradient-to-b from-indigo-500 rounded-2xl shadow-2xl pt-9 pr-9 pl-9 pb-7 ">
								<div className=" flex justify-center items-center pb-9 ml-[135px] mr-[135px]">
									<div className="bg-white p-8 rounded-full">
										<img src={logo} alt="" className="h-[120px] w-[120px]" />
									</div>
								</div>
								<form
									className="flex flex-col items-center"
									onSubmit={handleSubmit}>
									<div className=" flex justify-center items-center pb-9 ">
										<h2 className="text-[20px] font-bold text-white	">
											REGISTRATION
										</h2>
									</div>
									<div className="flex flex-col w-[400px] relative">
										<label className="text-[#2F3F73] font-semibold text-lg">
											Email
										</label>
										<input
											placeholder="Email"
											type="text"
											name="email"
											value={user.email}
											onChange={handleInputChange}
											className={`w-full mb-[10px] mt-[10px] h-[56px] outline-0 p-[10px] rounded-md ${
												inputError && error.email
													? "border-red-500 border-2 border-solid"
													: ""
											}`}
										/>
										{error.email
											? error.email && (
													<p className="text-[red] text-left font-semibold pt-[5px]">
														{error.email}
													</p>
											  )
											: null}
									</div>

									<div className="flex flex-col w-[400px]">
										<label className="text-[#2F3F73] font-semibold text-lg">
											User Name
										</label>
										<input
											placeholder="UserName"
											type="text"
											name="username"
											value={user.username}
											onChange={handleInputChange}
											className={`w-full mb-[10px] mt-[10px] h-[56px] outline-0 p-[10px] rounded-md ${
												inputError && error.username
													? "border-red-500 border-2 border-solid"
													: ""
											}`}
										/>
										{error.username
											? error.username && (
													<p className="text-[red] text-left font-semibold pt-[5px]">
														{error.username}
													</p>
											  )
											: null}
									</div>
									<div className="flex flex-col w-[400px]">
										<div className="text-[#2F3F73] font-semibold text-lg flex items-center">
											Password
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
										</div>
										<div className="relative">
											<input
												placeholder="Password"
												type={passwordVisible ? "text" : "password"}
												name="password"
												value={user.password}
												onChange={handleInputChange}
												autoComplete="new-password"
												className={`w-full mb-[10px] mt-[10px] h-[56px] outline-0 border-2 p-[10px] rounded-md ${
													inputError && error.password
														? "border-red-500 border-2 border-solid"
														: ""
												}`}
											/>
											<button
												type="button"
												className="absolute inset-y-0 right-0 flex items-center pr-3"
												onClick={togglePasswordVisibility}>
												{passwordVisible ? <IconOpenEye /> : <IconCloseEye />}
											</button>
										</div>
										{error.password
											? error.password && (
													<p className="text-[red] text-left font-semibold pt-[5px] ">
														{error.password}
													</p>
											  )
											: null}
									</div>
									<div className="flex flex-col w-[400px]">
										<label className="text-[#2F3F73] font-semibold text-lg">
											Confirm Password
										</label>

										<div className="relative">
											<input
												placeholder="Re-type Password"
												type={confirmPassword ? "text" : "password"}
												name="confirmPassword"
												value={user.confirmPassword}
												onChange={handleInputChange}
												autoComplete="new-password1"
												className={`w-full mb-[10px] mt-[10px] h-[56px] outline-0 border-2 p-[10px] rounded-md ${
													inputError && errConfirmPassword
														? "border-red-500 border-2 border-solid"
														: ""
												}`}
											/>
											<button
												type="button"
												className="absolute inset-y-0 right-0 flex items-center pr-3"
												onClick={toggleConfirmPasswordVisibility}>
												{confirmPassword ? <IconOpenEye /> : <IconCloseEye />}
											</button>
										</div>
										{errConfirmPassword
											? errConfirmPassword && (
													<p className="text-[red] text-left font-semibold pt-[5px]">
														{errConfirmPassword}
													</p>
											  )
											: null}
									</div>
									<div className="pt-[5px]">
										<button className="relative inline-flex  items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white ">
											<span className="relative px-[70px] py-[20px] transition-all ease-in duration-75 bg-white dark:bg-[#2F3F73] rounded-md group-hover:bg-opacity-0">
												REGISTER
											</span>
										</button>
									</div>
									<h5 className="text-[16px] pt-[1.5rem] mx-auto  ">
										Already have an account?
										<span className="ml-[5px]">
											<Link
												className="text-[#2F3F73] font-semibold"
												to="/login">
												Log in
											</Link>
										</span>
									</h5>
								</form>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default RegisterPage;
