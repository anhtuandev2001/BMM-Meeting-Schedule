import { Navigate } from "react-router-dom";
import { isNil } from "lodash";
import useAuth from "../../utils/useAuth";
import LoadingPage from "../pages/LoadingPage";

const PublicRoute = ({ children }) => {
	const { currentUser, loading } = useAuth();

	if (loading) {
		return <LoadingPage />;
	}

	return isNil(currentUser) ? children : <Navigate to="/" replace={true} />;
};

export default PublicRoute;
