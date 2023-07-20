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
import { I18nextProvider } from "react-i18next";
import i18next from "./assets/changesLanguage/i18n";

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
		<I18nextProvider i18n={i18next}>
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
		</I18nextProvider>
	</React.StrictMode>,
);
