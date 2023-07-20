import { getDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { db } from "../firebase";
import { auth } from "../firebase";
import { useDispatch } from "react-redux";
import { setEmailUser } from "../store/slices/userSlice";

const useAuth = () => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [role, setRole] = useState(null);
	const dispatch = useDispatch();

	useEffect(() => {
		return onAuthStateChanged(auth, async (user) => {
			if (user) {
				// user is signed in
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				if (userDoc.exists()) {
					setRole(userDoc.data().role);
				}
				setCurrentUser(user);
				dispatch(setEmailUser(user?.email));
			} else {
				// user is signed out
				setCurrentUser(null);
				setRole(null);
			}
			setLoading(false);
		});
	}, []);

	return { currentUser, loading, role, setLoading };
};

export default useAuth;
