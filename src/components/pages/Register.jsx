/* eslint-disable no-unused-vars */
// @ts-nocheck
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../assets/icon/logoBlueOC.png";
const Register = () => {
	const [user, setUser] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});
	const [errEmail, setErrorEmail] = useState("");
	const [errUserName, setErrUserName] = useState("");
	const [errPassword, setErrPassword] = useState("");
	const [errConfirmPassword, setErrConfirmPassword] = useState("");
	const [backError, setBackError] = useState("");
	const [loading, setLoading] = useState(false);

	const navigate = useNavigate();

	const handleChangeHandle = (event) => {
		const { name, value } = event.target;
		setUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};
	const handleSubmit = async (event) => {
		event.preventDefault();
		const { email, password, username, confirmPassword } = user;

		// Email validation
		if (email === "") {
			setInterval(() => {
				setErrorEmail("");
			}, 5000);
			setErrorEmail("Please fill in your email");
			return;
		}
		if (!email.includes("@")) {
			setInterval(() => {
				setErrorEmail("");
			}, 5000);
			setErrorEmail("Missing character '@' in your email");
			return;
		}

		// Username validation
		if (username === "") {
			setInterval(() => {
				setErrUserName("");
			}, 5000);
			setErrUserName("Please fill in your name");
			return;
		}

		// Password validation
		if (password === "") {
			setInterval(() => {
				setErrPassword("");
			}, 5000);
			setErrPassword("Please fill in your password");
			return;
		}
		if (password !== confirmPassword) {
			setInterval(() => {
				setErrConfirmPassword("");
			}, 5000);
			return setErrConfirmPassword("Passwords do not match");
		} else if (password.length <= 6) {
			setErrPassword("Password must be more than 6 characters");
			return;
		}

		navigate("/");
	};

	return (
		<>
			<div className="bg-login ">
				{loading ? (
					<div className="flex justify-center items-center  text-[80px] font-semibold h-full">
						Loading ....
					</div>
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
											REGISTRATION
										</h2>
									</div>
									<div className="mb-[25px]">
										<input
											placeholder="Email"
											type="text"
											name="email"
											value={user.email}
											onChange={handleChangeHandle}
											className="w-full h-[56px] outline-0 p-[10px] border-2 rounded-md"></input>
										{errEmail
											? errEmail && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{errEmail}
													</p>
											  )
											: backError && <p className="error">{backError}</p>}
									</div>
									<div className="mb-[25px]">
										<input
											placeholder="UserName"
											type="text"
											name="username"
											value={user.username}
											onChange={handleChangeHandle}
											className="w-full h-[56px] outline-0 p-[10px] border-2 rounded-md"></input>
										{errUserName
											? errUserName && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{errUserName}
													</p>
											  )
											: backError && <p className="error">{backError}</p>}
									</div>

									<div className="mb-[25px]">
										<input
											placeholder="Password"
											type="password"
											name="password"
											value={user.password}
											onChange={handleChangeHandle}
											className="w-full h-[56px] outline-0 border-2 p-[10px] rounded-md"></input>
										{errPassword
											? errPassword && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{errPassword}
													</p>
											  )
											: backError && <p className="error">{backError}</p>}
									</div>
									<div className="mb-[25px]">
										<input
											placeholder="Confirm Password"
											type="password"
											value={user.confirmPassword}
											onChange={handleChangeHandle}
											name="confirmPassword"
											className="w-full h-[56px] outline-0 border-2 p-[10px] rounded-md"></input>
										{errConfirmPassword
											? errConfirmPassword && (
													<p className="text-[red] text-left font-semibold pt-[1rem]">
														{errConfirmPassword}
													</p>
											  )
											: backError && <p className="error">{backError}</p>}
									</div>
									<div className="flex flex-col justify-center items-center bg-[#2F3F73]  rounded-md w-[50%]  mx-auto   ">
										<button
											type="submit"
											className="p-[20px] text-white w-[80%] text-center transition ease-in-out delay-100 ">
											Login
										</button>
									</div>

									<h5 className="text-[16px] pt-[1.5rem] mx-auto ">
										Do you already have an account
										<span className="ml-[5px]">
											<Link
												className="text-[#2F3F73] font-semibold"
												to="/login">
												Login Now !
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

export default Register;
