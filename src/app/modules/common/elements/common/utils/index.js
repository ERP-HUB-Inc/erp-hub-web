class Utils {
  isInvalidEmail(value) {
    return !value.match(/^([\w.%+-]+)@([\w-]+\.)+([\w]{2,})$/i);
  }

  isRequired(value) {
    return !value;
  }
}

export default new Utils;