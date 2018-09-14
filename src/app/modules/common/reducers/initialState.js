export default {
  request: (key="list") => {
    return {
      fetching: false,
      fetched: false,
      pagination: {
        limit: 0,
        offset: 0,
        total: 0
      },
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
  detail: (key="list") => {
    return {
      showForm: false,
      fetching: false,
      fetched: false,
      data: null,
      error: null,
      [key]: []
    };
  },
  orderNumber: (key="list") => {
    return {
      showForm: false,
      fetching: false,
      fetched: false,
      data: null,
      error: null,
      [key]: []
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
  },
  fetchingextend: (key="fetchingextend") => {
    return {
      fetching: false,
      fetched: false,
      pagination: {
        limit: 0,
        offset: 0,
        total: 0
      },
      [key]: [],
      error: null
    };
  }
};