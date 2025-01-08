import { createActionTypes } from "utils/helperFunctions";

export const HEADER_ACTIONS = createActionTypes("components/header", ["HANDLE_SEARCH"]);

export const handleSearchAction = (text) => ({
    type: HEADER_ACTIONS.HANDLE_SEARCH,
    payload: text
});
