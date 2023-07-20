// @ts-nocheck
import { useCallback, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// @ts-ignore
import logo from "../../assets/icon/logoBlueOC.png";
import { validator } from "../../utils/validator";
import { signInWithEmailAndPassword } from "firebase/auth";
import { toast } from "react-toastify";

import { auth } from "../../firebase";
import LoadingPage from "./LoadingPage";
import IconCloseEye from "../../assets/icon/IconForm/IconCloseEye";
import IconOpenEye from "../../assets/icon/IconForm/IconOpenEye";
import useAuth from "../../utils/useAuth";
import { useTranslation } from "react-i18next";
import Translation from "../Translation";

const LoginPage = () => {
	const { t } = useTranslation();
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState({
		email: "",
		password: "",
	});
	// To fix when I login we still see the login page for a few seconds
	const { loading, setLoading } = useAuth();
	const [passwordVisible, setPasswordVisible] = useState(false);
	const [inputError, setInputError] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (event) => {
		event.preventDefault();

		const { email, password } = user;

		const handleValidationError = (info, errorMessage) => {
			setTimeout(() => {
				setError((prevError) => ({
					...prevError,
					[info]: "",
				}));
				setInputError(false);
			}, 5000);

			setError((prevError) => ({
				...prevError,
				[info]: errorMessage,
			}));
			setInputError(true);
		};

		validator.validate(["empty", "email"], email, () => {
			handleValidationError("email", "Please fill in your email");
		});

		validator.validate(["empty"], password, () => {
			handleValidationError("password", "Please fill in your password");
		});
		// Check if any errors occurred
		if (email === "" || !email.includes("@") || password === "") {
			return;
		}
		try {
			setLoading(true);
			const userCredential = await signInWithEmailAndPassword(
				auth,
				user.email,
				user.password,
			);
			const users = userCredential.user;
			console.log(users);
			setLoading(false);
			navigate("/");
		} catch (error) {
			setLoading(false);
			if (
				error.code === "auth/wrong-password" ||
				error.code === "auth/user-not-found"
			) {
				toast.error("Invalid email or password");
			} else {
				toast.error(error.message);
			}
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = useCallback(
		(event) => {
			const { name, value } = event.target;
			setUser((prevUser) => ({
				...prevUser,
				[name]: value ?? user[name],
			}));
		},
		[setUser, user],
	);

	const togglePasswordVisibility = useCallback(() => {
		setPasswordVisible((prevState) => !prevState);
	}, []);
	const handleForgotPassword = useCallback(() => {
		navigate("/forgot-password");
	}, [navigate]);
	return (
		<>
			<div className="bg-login">
				{loading ? (
					<LoadingPage />
				) : (
					<div className=" container-small flex flex-col justify-center items-center   h-full">
						<div>
							<div className="form w-full bg-gradient-to-b from-indigo-500 rounded-2xl shadow-2xl p-7 ">
								<form className="flex flex-col" onSubmit={handleSubmit}>
									<div className=" flex justify-center items-center pb-9 ml-[135px] mr-[135px]">
										<div className="bg-white p-8 rounded-full">
											<img src={logo} alt="" className="h-[90px] w-[90px]" />
										</div>
									</div>
									<div className=" flex justify-center items-center pb-4">
										<h2 className="text-[20px] font-bold text-white	">
											{t("continue-to-blueoc")}
										</h2>
									</div>
									<div className="mb-[25px]">
										<label className="text-[#2F3F73] font-semibold text-lg">
											{t("email")}
										</label>
										<input
											placeholder={t("email")}
											value={user.email}
											onChange={handleInputChange}
											type="text"
											name="email"
											className={`w-full h-[45px] outline-0 p-[10px] border-2 rounded-md ${
												inputError && error.email
													? "border-red-500 border-2 border-solid"
													: ""
											} `}></input>
										{error?.email
											? error.email && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{error.email}
													</p>
											  )
											: null}
									</div>
									<div className="mb-[25px] ">
										<label className="text-[#2F3F73] font-semibold text-lg">
											{t("password")}
										</label>
										<div className="relative">
											<input
												placeholder={t("password")}
												type={passwordVisible ? "text" : "password"}
												value={user.password}
												onChange={handleInputChange}
												name="password"
												className={`w-full h-[45px] outline-0 border-2 p-[10px] rounded-md ${
													inputError && error.password
														? "border-red-500 border-2 border-solid"
														: ""
												}`}></input>
											<button
												type="button"
												className="absolute flex items-center pr-3 top-0 right-0 bottom-0"
												onClick={togglePasswordVisibility}>
												{passwordVisible ? <IconOpenEye /> : <IconCloseEye />}
											</button>
										</div>

										{error?.password
											? error.password && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{error.password}
													</p>
											  )
											: null}

										<div
											onClick={handleForgotPassword}
											className="text-[16px] pt-[5px] mx-auto float-right hover:text-[#2F3F73] cursor-pointer">
											{t("forgot-password")}
											<span className="ml-[5px]"></span>
										</div>
									</div>

									<div className="flex flex-col justify-center items-center ">
										<button className="relative inline-flex  items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white ">
											<span className="relative px-[70px] py-[15px] transition-all ease-in duration-75 bg-white dark:bg-[#2F3F73] rounded-md group-hover:bg-opacity-0">
												{t("login")}
											</span>
										</button>
									</div>

									<h5 className="text-[16px] pt-[15px] mx-auto ">
										{t("don't-have-an-account")}
										<span className="ml-[5px]">
											<Link className="text-[#2F3F73] font-bold" to="/register">
												{t("sign-up")}
											</Link>
										</span>
									</h5>
								</form>
								<div className="mx-auto max-w-[120px] bg-white rounded-[3px] mt-[16px]">
									<Translation />
								</div>
							</div>
						</div>
					</div>
				)}
			</div>
		</>
	);
};

export default LoginPage;
