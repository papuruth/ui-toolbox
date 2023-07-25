import { createStore, compose, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { routerMiddleware } from 'connected-react-router';
import thunkMiddleware from 'redux-thunk';
import history from 'routes/history';
import rootReducer from './rootReducer';
import sagas from './rootSagas';

const sagaMiddleware = createSagaMiddleware();
const middlewares = [sagaMiddleware, thunkMiddleware, routerMiddleware(history)];

const composeEnhancers = (process.env.NODE_ENV === 'development' && window !== undefined && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

const store = createStore(rootReducer(history), composeEnhancers(applyMiddleware(...middlewares)));

sagaMiddleware.run(sagas);

export default store;
