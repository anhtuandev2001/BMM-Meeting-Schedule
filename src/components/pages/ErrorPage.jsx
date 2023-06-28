import { Link } from "react-router-dom";
const ErrorPage = () => {
	return (
		<>
			<div className="flex justify-center items-center flex-col  w-full h-full">
				<h2>OOPS PAGE NOT FOUND</h2>
				<div className="p-3 bg-sky-400 rounded-xl text-white ">
					<Link to="/">GO TO HOME PAGE</Link>
				</div>
			</div>
		</>
	);
};

export default ErrorPage;
