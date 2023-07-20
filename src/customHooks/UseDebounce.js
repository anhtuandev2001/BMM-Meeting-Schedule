import { useEffect, useState } from "react";
function UseDebounce(value, duration) {
	const [debounceValue, setDebounceValue] = useState(value);
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebounceValue(value);
		}, duration);
		return () => {
			clearTimeout(timer);
		};
	}, [value, duration]);
	return debounceValue;
}

export default UseDebounce;
