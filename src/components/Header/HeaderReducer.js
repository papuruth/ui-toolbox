import Immutable from "seamless-immutable";
import { HEADER_ACTIONS } from "./HeaderAction";

const initialState = Immutable({
    searchQuery: "",
    commandPaletteOpen: false
});

export default (state = initialState, { type, payload } = {}) => {
    switch (type) {
        case HEADER_ACTIONS.HANDLE_SEARCH:
            return { ...state, searchQuery: payload };
        case HEADER_ACTIONS.TOGGLE_COMMAND_PALETTE:
            return { ...state, commandPaletteOpen: !state.commandPaletteOpen };
        case HEADER_ACTIONS.CLOSE_COMMAND_PALETTE:
            return { ...state, commandPaletteOpen: false };
        default:
            return state;
    }
};
