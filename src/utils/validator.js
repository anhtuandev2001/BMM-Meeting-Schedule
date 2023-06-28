class Validator {
	validate(type = [], data, callbackFn) {
		for (let i = 0; i < type.length; i++) {
			if (type[i] === "empty" && data.trim() === "") {
				return callbackFn instanceof Function ? callbackFn() : undefined;
			}

			if (type[i] === "email" && !data.includes("@")) {
				return callbackFn instanceof Function ? callbackFn() : undefined;
			}

			if (type[i] === "password") {
				const passwordRegex =
					/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,20}$/;
				if (!passwordRegex.test(data)) {
					return callbackFn instanceof Function ? callbackFn() : undefined;
				}
			}

			if (type[i] === "username") {
				const usernameRegex = /^[a-zA-Z0-9]{3,16}$/;
				if (!usernameRegex.test(data)) {
					return callbackFn instanceof Function ? callbackFn() : undefined;
				}
			}
		}
	}
}

export const validator = new Validator();
