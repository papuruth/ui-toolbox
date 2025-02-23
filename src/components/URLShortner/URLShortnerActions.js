import { createActionTypes } from "utils/helperFunctions";

export const UrlShortenerActions = createActionTypes("components/url-shortener", ["GET_SHORT_URL", "SET_SHORT_URL", "RESET_STATE"]);

export const getShortURL = (payload) => ({
    type: UrlShortenerActions.GET_SHORT_URL,
    payload
});
export const setShortURL = (payload) => ({
    type: UrlShortenerActions.SET_SHORT_URL,
    payload
});
export const reserURLShortenerReducerState = () => ({
    type: UrlShortenerActions.RESET_STATE
});
