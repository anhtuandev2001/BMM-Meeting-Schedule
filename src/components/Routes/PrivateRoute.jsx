import { Navigate } from "react-router-dom";
import { isNil } from "lodash";
import useAuth from "../../utils/useAuth";
import LoadingPage from "../pages/LoadingPage";

const PrivateRoute = ({ children }) => {
	const { currentUser, loading } = useAuth();
	if (loading) {
		return <LoadingPage />;
	}
	return isNil(currentUser) ? <Navigate to="/login" /> : children;
};

export default PrivateRoute;
