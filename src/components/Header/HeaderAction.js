import { createActionTypes } from "utils/helperFunctions";

export const HEADER_ACTIONS = createActionTypes("components/header", ["HANDLE_SEARCH", "TOGGLE_COMMAND_PALETTE", "CLOSE_COMMAND_PALETTE"]);

export const handleSearchAction = (text) => ({
    type: HEADER_ACTIONS.HANDLE_SEARCH,
    payload: text
});

export const toggleCommandPaletteAction = () => ({
    type: HEADER_ACTIONS.TOGGLE_COMMAND_PALETTE
});

export const closeCommandPaletteAction = () => ({
    type: HEADER_ACTIONS.CLOSE_COMMAND_PALETTE
});
