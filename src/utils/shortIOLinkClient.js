import { createClient } from "@short.io/client-browser";

const shortIOClient = createClient({
    publicKey: process.env.REACT_APP_SHORT_URL_API_PK
});

export default shortIOClient;
