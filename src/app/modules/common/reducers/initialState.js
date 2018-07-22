export default {
  request: (key="list") => {
    return {
      fetching: false,
      fetched: false,
      [key]: [],
      error: null
    };
  },
  archive: (key="success") => {
    return {
      archiving: false,
      archived: false,
      [key]: false,
      error: null
    };
  },
  update: (key="response") => {
    //TODO Here
  },
  add: (key="response") => {
    return {
      adding: false,
      added: false,
      [key]: null,
      error: null
    };
  }
};