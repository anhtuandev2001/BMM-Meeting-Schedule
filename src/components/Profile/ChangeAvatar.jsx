// @ts-nocheck
import { LoadingButton } from "@mui/lab";
import {
	deleteObject,
	getDownloadURL,
	ref,
	uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { storage } from "../../firebase";
import { handleAvatarUrl } from "../../store/slices/avatarUrl";
import useAuth from "../../utils/useAuth";
import update from "../../assets/image/update-avatar.png";

function ChangeAvatar({ onCloseModal }) {
	const [isButtonLoading, setIsButtonLoading] = useState(false);
	const dispatch = useDispatch();
	const [isDisable, setIsDisable] = useState(true);
	const { currentUser } = useAuth();
	const [selectedImage, setSelectedImage] = useState(null);
	const [imageUrl, setImageUrl] = useState("");

	const onDrop = (acceptedFiles) => {
		const file = acceptedFiles[0];
		const reader = new FileReader();
		reader.onload = () => {
			setIsDisable(false);
			setImageUrl(reader.result);
			setSelectedImage(file);
		};
		reader.readAsDataURL(file);
	};

	const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

	const handleUpload = () => {
		if (selectedImage) {
			const storageRef = ref(storage, `users/${currentUser.uid}/avatar.jpg`);
			const previousImageRef = ref(
				storage,
				`users/${currentUser.uid}/avatar.jpg`,
			);
			setIsButtonLoading(true);
			deleteObject(previousImageRef)
				.then(() => {
					uploadBytes(storageRef, selectedImage)
						.then(() => {
							setIsButtonLoading(false);
							toast.success("Image uploaded successfully");
							getDownloadURL(storageRef).then((url) => {
								dispatch(handleAvatarUrl(url));
							});
							onCloseModal();
						})
						.catch(() => {
							setIsButtonLoading(false);
							toast.error("Error uploading image");
						});
				})
				.catch(() => {
					uploadBytes(storageRef, selectedImage)
						.then(() => {
							setIsButtonLoading(false);
							toast.success("Image uploaded successfully");
							getDownloadURL(storageRef).then((url) => {
								dispatch(handleAvatarUrl(url));
							});
							onCloseModal();
						})
						.catch(() => {
							setIsButtonLoading(false);
							toast.error("Error uploading image");
						});
				});
		}
	};
	return (
		<div className="flex flex-col justify-between h-full">
			<div className="text-center">
				<div
					{...getRootProps()}
					className={`dropzone ${isDragActive ? "active" : ""}`}>
					<input {...getInputProps()} />
					{imageUrl ? (
						<div>
							<img
								src={imageUrl}
								alt="Uploaded"
								className="preview-image h-[290px] mx-auto"
							/>
							<span className="mt-[20px] inline-block border bg-[#f6f6f7] py-2 px-3 rounded-sm text-[#42526e]">
								Drag and drop or click your image to change it
							</span>
						</div>
					) : (
						<>
							{isDragActive ? (
								<div className="w-[200px] h-[200px] before:animate-spin before:border-blue-900 flex flex-col relative items-center justify-center mx-auto before:border-[2px] before:border-dashed before:rounded-full before:absolute before:h-[200px] before:w-[200px]">
									<div className="bg-blue-400 opacity-60 rounded-full flex justify-center items-center flex-col h-[200px] w-[200px]">
										<img
											src={update}
											alt=""
											className="mx-auto w-[100px] h-[78px]"
										/>
										<span>Drag and drop or click your images here</span>
									</div>
								</div>
							) : (
								<div>
									<div className="w-[200px] h-[200px] flex flex-col relative items-center justify-center mx-auto before:border-[2px] before:border-dashed before:rounded-full before:absolute before:h-[200px] before:w-[200px]">
										<img
											src={update}
											alt=""
											className="mx-auto w-[100px] h-[78px]"
										/>
										<span>Drag and drop or click your images here</span>
									</div>
								</div>
							)}
						</>
					)}
				</div>
			</div>
			<div className="flex justify-between">
				<button className="btn text-[#42526E]" onClick={onCloseModal}>
					Discard
				</button>
				<LoadingButton
					variant="contained"
					type="submit"
					sx={{
						textTransform: "capitalize",
					}}
					disabled={isDisable}
					onClick={handleUpload}
					loading={isButtonLoading}>
					Change
				</LoadingButton>
			</div>
		</div>
	);
}

export default ChangeAvatar;
