function SkeletonLoading() {
	return (
		<div role="status" className="max-w-sm animate-pulse">
			<div className="h-5 bg-gray-200 rounded-full dark:bg-gray-700 "></div>
			<span className="sr-only">Loading...</span>
		</div>
	);
}
export default SkeletonLoading;
