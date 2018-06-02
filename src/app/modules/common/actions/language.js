import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";

export function initLanguage() {
    return initialize([
        { name: "English", code: "en" },
        { name: "French", code: "fr" },
        { name: "Espance", code: "es" }
    ]);
}

export function setTranslation() {
    return addTranslation({...headers, ...footers});
}