// @ts-nocheck
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { useSelector } from "react-redux";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";
import Header from "./components/Header";
import LayOut from "./components/Layout";

function App() {
	const { isLoading = false } = useSelector((state) => state.loading);
	return (
		<>
			<Header />
			<LayOut />
			<Backdrop
				sx={{
					color: "#fff",
					zIndex: 100,
					"& .MuiBackdrop-root": {
						zIndex: 100,
					},
				}}
				open={isLoading}>
				<CircularProgress color="inherit" />
			</Backdrop>
		</>
	);
}

export default App;
