import { initialize, addTranslation } from "react-localize-redux";
import headers from "../languages/headers";
import footers from "../languages/footers";
import sidebar from "../languages/sidebar";
import text from "../elements/common/language/text";
import title from "../elements/common/language/title";
import error from "../elements/common/language/error";

export function initLanguage() {
  return initialize([
    { name: "English", code: "en" },
    { name: "French", code: "fr" }
  ]);
}

export function setTranslation() {
  return addTranslation({
    ...headers,
    ...footers,
    ...text,
    ...title,
    ...error,
    ...sidebar
  });
}