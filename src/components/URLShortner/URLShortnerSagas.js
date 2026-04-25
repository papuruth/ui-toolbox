import { call, put, takeEvery } from "redux-saga/effects";
import toast from "utils/toast";
import api from "services/api";
import { setShortURL, UrlShortenerActions } from "./URLShortnerActions";

function* getShortURLSaga(action) {
    try {
        const { longUrl } = action.payload || {};
        const response = yield call(api.get, `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`);
        if (response?.data) {
            yield put(setShortURL({ shortenedLink: response.data }));
        }
    } catch (error) {
        toast.error(error?.message);
    }
}
export default function* urlShortenerWatcherSaga() {
    yield takeEvery(UrlShortenerActions.GET_SHORT_URL, getShortURLSaga);
}
