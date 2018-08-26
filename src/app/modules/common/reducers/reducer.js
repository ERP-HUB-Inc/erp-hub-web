import InitialState from "./initialState";

export default {
  request: (state, action, [PEDDING, REJECT, FULFILLED, RESET]) => {
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
        pagination: action.payload.data.pagination,
        list: action.payload.data.data
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
  add: (state, action, [PEDDING, REJECT, FULFILLED, SHOW_FORM, RESET]) => {
    switch(action.type) {
    case SHOW_FORM: {
      return {
        ...state,
        showForm: true
      };
    }
    case PEDDING: {
      return {
        ...state,
        adding: true,
        showForm: true
      };
    }
    case REJECT: {
      return {
        ...state,
        adding: false,
        showForm: true,
        error: action.payload.response.data
      };
    }
    case FULFILLED: {
      return {
        ...state,
        adding: false,
        showForm: false,
        added: true,
        response: action.payload.data
      };
    }
    case RESET: {
      return {
        adding: false,
        showForm: false,
        added: false,
        response: null
      };
    }
    default: 
      return state;
    }
  },
  update: (state, action, [PEDDING, REJECT, FULFILLED, SHOW_FORM, RESET]) => {
    switch(action.type) {
    case SHOW_FORM: {
      return {
        ...state,
        data: action.payload,
        showForm: true
      };
    }
    case PEDDING: {
      return {
        ...state,
        updating: true,
        showForm: true
      };
    }
    case REJECT: {
      return {
        ...state,
        updating: false,
        showForm: true,
        error: action.payload.response
      };
    }
    case FULFILLED: {
      return {
        ...state,
        updating: false,
        showForm: false,
        updated: true,
        response: action.payload.data
      };
    }
    case RESET: {
      return {
        updating: false,
        showForm: false,
        updated: false,
        response: null
      };
    }
    default: 
      return state;
    }
  },
  detail: (state, action, [PEDDING, REJECT, FULFILLED, RESET]) => {
    switch(action.type) {
    case PEDDING: {
      return {
        ...state,
        fetching: true,
        showForm: false
      };
    }
    case REJECT: {
      return {
        ...state,
        fetching: false,
        showForm: false,
        error: action.payload.data
      };
    }
    case FULFILLED: {
      return {
        ...state,
        fetching: false,
        showForm: true,
        fetched: true,
        data: action.payload.data.data
      };
    }
    case RESET: {
      return InitialState.detail();
    }
    default: 
      return state;
    }
  }
};