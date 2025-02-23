import urlShortenerWatcherSaga from "components/URLShortner/URLShortnerSagas";
import { all } from "redux-saga/effects";

export default function* rootSaga() {
    yield all([urlShortenerWatcherSaga()]);
}
