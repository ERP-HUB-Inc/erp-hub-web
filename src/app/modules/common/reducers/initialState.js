export default {
  request: (key="datas") => {
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
  }
};