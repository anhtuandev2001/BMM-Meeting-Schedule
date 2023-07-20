import { Navigate } from "react-router-dom";
import { isNil } from "lodash";
import useAuth from "../../utils/useAuth";
import LoadingPage from "../pages/LoadingPage";
// import { useLocation } from "react-router-dom";
// props routeTypes: private, public to handle route
const AuthRoute = ({ children, routeType }) => {
	const { currentUser, loading } = useAuth();

	if (loading) {
		return <LoadingPage />;
	}

	// if routeType = private so user must be logged in to access this route so if user is not logged in redirect to login page , if not render the children
	if (routeType === "private") {
		return isNil(currentUser) ? (
			<Navigate to="/login" replace={true} />
		) : (
			children
		);
	}
	// this line I check route of login and log out.
	if (routeType === "public") {
		return isNil(currentUser) ? children : <Navigate to="/" replace={true} />;
	}

	return children;
};

export default AuthRoute;

// I have another way to useLocation to solve this problem , when use this way dont need props routeType in AuthRoute component
// const location = useLocation();
// const path = location.pathname;
// if (isNil(currentUser) && path !== "/login") {
// 	return <Navigate to="/login" replace={true} />;
// }

// if (!isNil(currentUser) && (path === "/login" || path === "/register")) {
// 	return <Navigate to="/" replace={true} />;
// }
