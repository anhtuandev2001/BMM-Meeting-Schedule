import { Navigate } from "react-router-dom";
import useAuth from "../../utils/useAuth";
import LoadingPage from "../pages/LoadingPage";

const SuperRoute = ({ children }) => {
	const { role, loading } = useAuth();

	if (loading) {
		return <LoadingPage />;
	}

	if (role === "admin") {
		return children;
	} else {
		return <Navigate to="/" />;
	}
};

export default SuperRoute;
