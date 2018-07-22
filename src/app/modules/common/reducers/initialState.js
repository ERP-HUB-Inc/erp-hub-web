export default {
  request: (key="list") => {
    return {
      fetching: false,
      fetched: false,
      [key]: [],
      error: null
    };
  },
  archive: (key="datas") => {
    return {
      archiving: false,
      archived: false,
      [key]: false,
      error: null
    };
  },
  update: (key="datas") => {
    //TODO Here
  },
  add: (key="datas") => {
    return {
      adding: false,
      added: false,
      [key]: false,
      error: null
    };
  }
};