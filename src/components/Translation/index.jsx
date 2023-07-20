/* eslint-disable react-hooks/exhaustive-deps */
import { RiArrowDropDownLine } from "react-icons/ri";
import { Popover } from "@mui/material";
import { languagesList } from "../../assets/changesLanguage/languages";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

function Translation() {
	const [show, setShow] = useState(false);
	// const [language,setLanguage] = useState('en')
	const { i18n } = useTranslation();
	const [language, setLanguage] = useState(["", ""]);
	const onChangeLanguage = (lang, name) => {
		localStorage.setItem("lang", JSON.stringify([name, lang]));
		i18n.changeLanguage(lang);
		setLanguage([name, lang]);
		setShow(false);
	};
	useEffect(() => {
		const langOnStore = JSON.parse(localStorage.getItem("lang"));
		if (langOnStore) {
			setLanguage(langOnStore);
			i18n.changeLanguage(langOnStore[1]);
		} else {
			setLanguage(["English", "en"]);
			localStorage.setItem("lang", JSON.stringify(["English", "en"]));
		}
	}, []);

	return (
		<div id="translation" className="px-2 rounded-[3px] cursor-pointer ">
			<div className="flex justify-between" onClick={() => setShow(true)}>
				<div className="pl-1 py-2 font-bold text-md ">{language[0]}</div>
				<div className="my-auto text-3xl">
					<RiArrowDropDownLine />
				</div>
			</div>
			<Popover
				open={show}
				onClose={() => setShow(false)}
				anchorEl={document.getElementById("translation")}
				anchorOrigin={{
					vertical: "bottom",
					horizontal: "left",
				}}>
				<div className="p-2  text-[#344563]">
					{Object.keys(languagesList).reduce((accumulate, currentValue) => {
						const data = languagesList[currentValue];
						const HTMLelement = (
							<div
								key={currentValue}
								className={
									data === language[1]
										? "p-2 pr-4 cursor-pointer hover:opacity-80 bg-gray-100 text-md font-bold rounded-[3px]"
										: "p-2 pr-4 cursor-pointer hover:opacity-80 hover:bg-gray-100 text-md font-bold rounded-[3px]"
								}
								onClick={() => onChangeLanguage(data, currentValue)}>
								<p>{currentValue}</p>
							</div>
						);
						return [...accumulate, HTMLelement];
					}, [])}
				</div>
			</Popover>
		</div>
	);
}

export default Translation;
