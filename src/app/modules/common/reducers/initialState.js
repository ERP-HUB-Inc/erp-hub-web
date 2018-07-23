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
    return {
      showForm: false,
      updating: false,
      updated: false,
      data: null,
      [key]: null,
      error: null
    };
  },
  add: (key="response") => {
    return {
      showForm: false,
      adding: false,
      added: false,
      [key]: null,
      error: null
    };
  }
};