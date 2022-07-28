import { getActiveLanguage } from "react-localize-redux";

function getCurrentIndexLanguage(state) {
  const currentLanguage = getActiveLanguage(state)
  for (var i=0; i<state.languages.length; i++) {
    if (state.languages[i].code ===currentLanguage.code) {
      return i;
    }
  }
}

export function  stringTranslate(key, state) {
  const currentIndex = getCurrentIndexLanguage(state);

  if (state.translations[key] == null) return null;

  return state.translations[key][currentIndex];
}