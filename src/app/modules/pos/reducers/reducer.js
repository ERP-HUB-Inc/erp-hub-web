export default {
  request: (state, action, [PEDDING, REJECT, FULFILLED]) => {
    switch(action.type) {
    case PEDDING: {
      return {
        ...state,
        fetching: true
      };
    }
    case REJECT: {
      return {
        ...state,
        fetching: false,
        error: action.payload.data
      };
    }
    case FULFILLED: {
      return {
        ...state, 
        fetching: false,
        fetched: true,
        list: action.payload.data
      };
    }
    default:
      return state;
    }
  },
  archive: (state, action, [PEDDING, REJECT, FULFILLED]) => {
    switch(action.type) {
    case PEDDING: {
      return {
        ...state,
        archiving: true
      };
    }
    case REJECT: {
      return {
        ...state,
        archiving: false,
        error: action.payload.data
      };
    }
    case FULFILLED: {
      return {
        ...state, 
        archiving: false,
        archived: true,
        success: action.payload.data
      };
    }
    default:
      return state;
    }
  },
  add: (state, action, [PEDDING, REJECT, FULFILLED, RESET]) => {
    switch(action.type) {
    case PEDDING: {
      return {
        ...state,
        adding: true
      };
    }
    case REJECT: {
      return {
        ...state,
        adding: false,
        error: action.payload.data
      };
    }
    case FULFILLED: {
      return {
        ...state, 
        adding: false,
        added: true,
        response: action.payload.data
      };
    }
    case RESET: {
      return {
        ...state, 
        adding: false,
        added: false,
        response: null
      };
    }
    default: 
      return state;
    }
  }
};