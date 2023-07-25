import Immutable from 'seamless-immutable';
import { HEADER_ACTIONS } from './HeaderAction';

const initialState = Immutable({
  searchQuery: '',
});

export default (state = initialState, { type, payload } = {}) => {
  switch (type) {
    case HEADER_ACTIONS.HANDLE_SEARCH:
      return { ...state, searchQuery: payload };
    default:
      return state;
  }
};
