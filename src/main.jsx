import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import Routers from "./components/Routes/Routes.jsx";
import { Provider } from "react-redux";
import store from "./store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./index.css";
ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<Provider store={store}>
			<ToastContainer
				position="top-right"
				autoClose={2000}
				hideProgressBar={true}
			/>
			<BrowserRouter>
				<Routers />
			</BrowserRouter>
		</Provider>
	</React.StrictMode>,
);
