import { ErrorMessage, Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";

export const SignUpForm = () => {
	// const { currentUser } = useAuth();

	// const changePassword = (currentPassword, newPassword) => {
	// 	const credential = firebase.auth.EmailAuthProvider.credential(
	// 		currentUser.email,
	// 		currentPassword,
	// 	);

	// 	if (currentPassword === newPassword) {
	// 		console.log("Mật khẩu mới phải khác với mật khẩu cũ.");
	// 		return;
	// 	}

	// 	currentUser
	// 		.reauthenticateWithCredential(credential)
	// 		.then(() => {
	// 			return currentUser.updatePassword(newPassword);
	// 		})
	// 		.then(() => {
	// 			console.log("Mật khẩu đã được thay đổi thành công!");
	// 		})
	// 		.catch((error) => {
	// 			console.log("Lỗi khi thay đổi mật khẩu:", error);
	// 		});
	// };

	const [initialValues, setInitialValues] = useState({
		userName: "",
		email: "",
		currentPassword: "",
		newPassword: "",
		confirmPassword: "",
	});

	// useEffect(() => {
	// 	setInitialValues((state) => {
	// 		return {
	// 			...state,
	// 			email: currentUser?.email,
	// 			userName: currentUser?.displayName,
	// 		};
	// 	});
	// }, [currentUser]);

	return (
		<Formik
			initialValues={initialValues}
			enableReinitialize={true}
			validationSchema={Yup.object({
				userName: Yup.string()
					.max(15, "Must be 15 characters or less")
					.required("Required"),
				email: Yup.string().email("Invalid email address").required("Required"),
				currentPassword: Yup.string().required("Required"),
				newPassword: Yup.string()
					.min(6, "Password must be at least 6 characters")
					.required("Required"),
				confirmPassword: Yup.string()
					.oneOf([Yup.ref("newPassword"), null], "Passwords must match")
					.required("Required"),
			})}
			onSubmit={(values, { setSubmitting }) => {
				setTimeout(() => {
					changePassword(values.currentPassword, values.newPassword);
					setSubmitting(false);
				}, 400);
			}}>
			<Form>
				<div className="my-4">
					<label htmlFor="userName" className="mr-3">
						Name:
					</label>
					<Field name="userName" type="text" />
					<ErrorMessage name="userName" />
				</div>

				<div className="my-4">
					<label htmlFor="email" className="mr-3">
						Email:
					</label>
					<Field name="email" type="email" />
					<ErrorMessage name="email" />
				</div>

				<div className="my-4">
					<label htmlFor="currentPassword" className="mr-3">
						Current Password:
					</label>
					<Field name="currentPassword" type="password" />
					<ErrorMessage name="currentPassword" />
				</div>

				<div className="my-4">
					<label htmlFor="newPassword" className="mr-3">
						New Password:
					</label>
					<Field name="newPassword" type="password" />
					<ErrorMessage name="newPassword" />
				</div>

				<div className="my-4">
					<label htmlFor="confirmPassword" className="mr-3">
						Confirm Password:
					</label>
					<Field name="confirmPassword" type="password" />
					<ErrorMessage name="confirmPassword" />
				</div>

				<button type="submit">Submit</button>
			</Form>
		</Formik>
	);
};
