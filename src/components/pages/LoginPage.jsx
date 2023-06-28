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

const LoginPage = () => {
	const [user, setUser] = useState({
		email: "",
		password: "",
	});
	const [error, setError] = useState({
		email: "",
		password: "",
	});

	const [isLoading, setLoading] = useState(false);
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

	return (
		<>
			<div className="bg-login ">
				{isLoading ? (
					<LoadingPage />
				) : (
					<div className=" container-small flex flex-col justify-center items-center   h-full">
						<div>
							<div className="form w-full bg-gradient-to-b from-indigo-500 rounded-2xl shadow-2xl pt-9 pr-9 pl-9 pb-7 ">
								<form className="flex flex-col" onSubmit={handleSubmit}>
									<div className=" flex justify-center items-center pb-9 ml-[135px] mr-[135px]">
										<div className="bg-white p-8 rounded-full">
											<img src={logo} alt="" className="h-[120px] w-[120px]" />
										</div>
									</div>
									<div className=" flex justify-center items-center pb-9">
										<h2 className="text-[20px] font-bold text-white	">
											CONTINUE TO BLUEOC
										</h2>
									</div>
									<div className="mb-[25px]">
										<label className="text-[#2F3F73] font-semibold text-lg">
											Email
										</label>
										<input
											placeholder="Email"
											value={user.email}
											onChange={handleInputChange}
											type="text"
											name="email"
											className={`w-full h-[56px] outline-0 p-[10px] border-2 rounded-md ${
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
											Password
										</label>
										<div className="relative">
											<input
												placeholder="Password"
												type={passwordVisible ? "text" : "password"}
												value={user.password}
												onChange={handleInputChange}
												name="password"
												className={`w-full h-[56px] outline-0 border-2 p-[10px] rounded-md ${
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
									</div>

									<div className="flex flex-col justify-center items-center ">
										<button className="relative inline-flex  items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white ">
											<span className="relative px-[70px] py-[20px] transition-all ease-in duration-75 bg-white dark:bg-[#2F3F73] rounded-md group-hover:bg-opacity-0">
												LOGIN
											</span>
										</button>
									</div>

									<h5 className="text-[16px] pt-[1.5rem] mx-auto ">
										Don't have an account ?
										<span className="ml-[5px]">
											<Link className="text-[#2F3F73] font-bold" to="/register">
												Sign up
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

export default LoginPage;
