import HeaderReducer from 'components/Header/HeaderReducer';
import { connectRouter } from 'connected-react-router';
import { combineReducers } from 'redux';

export default (history) =>
  combineReducers({
    router: connectRouter(history),
    headerReducer: HeaderReducer,
  });
