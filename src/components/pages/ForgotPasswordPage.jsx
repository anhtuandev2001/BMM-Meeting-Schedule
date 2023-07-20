// @ts-nocheck
// ForgotPasswordPage.jsx
import { useState } from "react";
import { toast } from "react-toastify";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase";
import logo from "../../assets/icon/logoBlueOC.png";
import IconRules from "../../assets/icon/IconForm/IconRules";
import { useNavigate } from "react-router-dom";
import LoadingPage from "./LoadingPage";
import { useTranslation } from "react-i18next";
const ForgotPasswordPage = () => {
	const { t } = useTranslation();
	const [email, setEmail] = useState("");
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();
	const handleInputChange = (event) => {
		setEmail(event.target.value);
	};

	const handleResetPassword = async (event) => {
		event.preventDefault();
		setLoading(true);

		try {
			await sendPasswordResetEmail(auth, email);
			toast.success("Check your email for further instructions");
		} catch (error) {
			toast.error(error.message);
		}

		setLoading(false);
	};
	const handleBackToLogin = () => {
		navigate("/login");
	};

	return (
		<div className="bg-login">
			{loading ? (
				<LoadingPage />
			) : (
				<div className="container-small flex flex-col justify-center items-center h-screen">
					<div>
						<div className="form w-full bg-gradient-to-b from-indigo-500 rounded-2xl shadow-2xl pt-9 pr-9 pl-9 pb-7">
							<div className="flex justify-center items-center pb-9 ml-[135px] mr-[135px]">
								<div className="bg-white p-8 rounded-full">
									<img src={logo} alt="" className="h-[90px] w-[90px]" />
								</div>
							</div>
							<form
								className="flex flex-col items-center"
								onSubmit={handleResetPassword}>
								<div className=" flex justify-center items-center pb-9 text-center">
									<h2 className="text-[20px] font-bold text-white	">
										{t("forgot-password")}
										<span className=" block mt-[15px] font-light text-[15px]">
											{t("forgot-password-message")}
										</span>
									</h2>
								</div>
								<div className="flex flex-col w-[400px] relative">
									<div className="text-[#2F3F73] font-semibold text-lg flex items-center">
										{t("email")}
										<div
											data-tooltip-target="tooltip-bottom"
											data-tooltip-placement="bottom"
											className=" ml-2  hover:cursor-pointer">
											<div className="group">
												<IconRules />
												<div
													className="absolute opacity-0 group-hover:opacity-100 text-xs bg-gray-800  text-white p-2 rounded-md transform translate-y-2 py-[15px] px-[15px]  pointer-events-none transition-opacity duration-200  z-10 "
													style={{ width: "fit-content" }}>
													<p>{t("forgot-password-message-pop")}</p>
												</div>
											</div>
										</div>
									</div>
									<input
										placeholder="User@gmail.com"
										type="text"
										name="email"
										value={email}
										onChange={handleInputChange}
										className="w-full mb-[10px] mt-[10px] h-[45px] outline-0 p-[10px] rounded-md"
									/>
								</div>

								<div className="pt-[5px] ">
									<div className="flex flex-col justify-center items-center ">
										<button className="relative inline-flex  items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-cyan-500 to-blue-500 group-hover:from-cyan-500 group-hover:to-blue-500 hover:text-white dark:text-white ">
											<span className="relative px-[70px] py-[15px] transition-all ease-in duration-75 bg-white dark:bg-[#2F3F73] rounded-md group-hover:bg-opacity-0">
												{t("send-instructions")}
											</span>
										</button>
									</div>
								</div>
								<div className="pt-[15px] ">
									<button
										onClick={handleBackToLogin}
										className="inline-flex items-center px-[80px] py-3 text-gray-500 bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600 border ">
										<span className="mr-[5px]">
											<svg
												xmlns="http://www.w3.org/2000/svg"
												fill="none"
												viewBox="0 0 24 24"
												strokeWidth="1.5"
												stroke="currentColor"
												className="w-6 h-6">
												<path
													strokeLinecap="round"
													strokeLinejoin="round"
													d="M6.75 15.75L3 12m0 0l3.75-3.75M3 12h18"
												/>
											</svg>
										</span>
										{t("back-to-login")}
									</button>
								</div>
							</form>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default ForgotPasswordPage;
