import { call, put, takeEvery } from "redux-saga/effects";
import toast from "utils/toast";
import api from "services/api";
import { setShortURL, UrlShortenerActions } from "./URLShortnerActions";

function* getShortURLSaga(action) {
    try {
        const { requestPayload } = action.payload || {};
        const response = yield call(api.post, "https://api-ssl.bitly.com/v4/shorten", requestPayload);
        if (response?.data?.link) {
            const { link } = response.data;
            yield put(setShortURL({ shortenedLink: link }));
        }
    } catch (error) {
        toast.error(error?.message);
    }
}
export default function* urlShortenerWatcherSaga() {
    yield takeEvery(UrlShortenerActions.GET_SHORT_URL, getShortURLSaga);
}
