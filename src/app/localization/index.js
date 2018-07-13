import { setActiveLanguage } from "react-localize-redux";
import {
  initLanguage,
  setTranslation
} from "../modules/common/actions/language";

export default class Localization {
  constructor(store) {
    store.dispatch(initLanguage());
    store.dispatch(setTranslation());
    store.dispatch(setActiveLanguage("fr"));
    return store;
  }
}