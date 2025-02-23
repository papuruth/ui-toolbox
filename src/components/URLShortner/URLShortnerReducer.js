import Immutable from "seamless-immutable";
import { UrlShortenerActions } from "./URLShortnerActions";

const initialState = Immutable({
    shortenedLink: ""
});

const { SET_SHORT_URL, RESET_STATE } = UrlShortenerActions;
export default (state = initialState, action = {}) => {
    const { type, payload } = action || {};
    switch (type) {
        case SET_SHORT_URL:
            return { ...state, ...payload };
        case RESET_STATE:
            return initialState;
        default:
            return state;
    }
};
