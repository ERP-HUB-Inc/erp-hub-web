import { initialize, addTranslation } from "react-localize-redux";
import { header } from "../languages/header";
import { footer } from "../languages/footer";

export function initLanguage() {
    return initialize([
        { name: "English", code: "en" },
        { name: "French", code: "fr" },
        { name: "Espance", code: "es" }
    ]);
}

export function setTranslation() {
    return addTranslation({...header, ...footer});
}