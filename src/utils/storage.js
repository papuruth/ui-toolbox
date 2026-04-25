const prefix = "@neutron:";

const storageKeys = {
    token: `${prefix}token`,
    recentTools: `${prefix}recent_tools`,
    theme: `${prefix}theme`
};

const MAX_RECENT_TOOLS = 4;

export default {
    // Token
    setToken: (token) => localStorage.setItem(storageKeys.token, token),
    getToken: () => localStorage.getItem(storageKeys.token),
    removeToken: () => localStorage.removeItem(storageKeys.token),

    // Recently used tools
    setRecentTool: (route) => {
        try {
            const current = JSON.parse(localStorage.getItem(storageKeys.recentTools) || "[]");
            const updated = [route, ...current.filter((r) => r !== route)].slice(0, MAX_RECENT_TOOLS);
            localStorage.setItem(storageKeys.recentTools, JSON.stringify(updated));
        } catch {
            // ignore storage errors
        }
    },
    getRecentTools: () => {
        try {
            return JSON.parse(localStorage.getItem(storageKeys.recentTools) || "[]");
        } catch {
            return [];
        }
    }
};
