// @ts-nocheck
import { Link } from "react-router-dom";
import pngwing from "../../assets/image//pngwing.com.png";

const Setting = () => {
	return (
		<div className="flex items-center justify-around h-full ">
			<div className="flex flex-col items-center  ">
				<h1 className="text-6xl">UNDER</h1>
				<h1 className="text-6xl">CONSTRUCTION</h1>
				<p className="text-[24px] pt-5 pb-5 tracking-wider leading-8 text-center">
					We will be celebrating the <br /> launch of our page very soon!
				</p>

				<Link
					to="/"
					className="relative inline-flex  items-center justify-center p-0.5 mb-2 mr-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white dark:text-white focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800">
					<span className="relative px-5 py-2.5 transition-all ease-in duration-75 bg-white dark:bg-gray-900 rounded-md group-hover:bg-opacity-0">
						GO TO HOME PAGE
					</span>
				</Link>
			</div>
			<img src={pngwing} alt="pngwing" />
		</div>
	);
};

export default Setting;
