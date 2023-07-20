import i18next from "i18next";
import Backend from "i18next-http-backend";
import LanguageDetector from "i18next-browser-languagedetector";
import { initReactI18next } from "react-i18next";
import { common_vn, common_en, common_jp } from "./translation";

const data = localStorage.getItem("lang");
const initLang = data ? data[1] : "en";

i18next
	.use(Backend)
	.use(LanguageDetector)
	.use(initReactI18next)
	.init({
		interpolation: { escapeValue: false },
		lng: initLang,
		resources: {
			en: {
				translation: { ...common_en },
			},
			vn: {
				translation: { ...common_vn },
			},
			ja: {
				translation: { ...common_jp },
			},
		},
	});

export default i18next;
