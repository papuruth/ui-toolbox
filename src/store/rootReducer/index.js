import HeaderReducer from "components/Header/HeaderReducer";
import URLShortnerReducer from "components/URLShortner/URLShortnerReducer";
import { connectRouter } from "connected-react-router";
import { combineReducers } from "redux";

export default (history) =>
    combineReducers({
        router: connectRouter(history),
        headerReducer: HeaderReducer,
        urlShortenerReducer: URLShortnerReducer
    });
