import { createContext, useContext } from "react";

const ColorModeContext = createContext({
    mode: "light",
    toggleColorMode: () => {}
});

export const useColorMode = () => useContext(ColorModeContext);

export default ColorModeContext;
