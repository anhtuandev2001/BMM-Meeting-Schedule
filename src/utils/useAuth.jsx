import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, db } from "../firebase";

const useAuth = () => {
	const [loading, setLoading] = useState(true);
	const [currentUser, setCurrentUser] = useState(null);
	const [role, setRole] = useState(null);

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
			} else {
				// user is signed out
				setCurrentUser(null);
				setRole(null);
			}
			setLoading(false);
		});
	}, []);

	return { currentUser, loading, role };
};

export default useAuth;
