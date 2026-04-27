import { CallSplit } from "@mui/icons-material";
import { Button, ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Popover, Typography } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { useToolChain } from "context/ToolChainContext";

/**
 * M5 — SendToButton
 * Shows a "Send to..." popover listing compatible target tools.
 * @param {string} value  The value to send
 * @param {Array<{label: string, route: string, icon: ReactNode}>} targets  Compatible tools
 */
export default function SendToButton({ value, targets = [] }) {
    const dispatch = useDispatch();
    const { sendTo } = useToolChain();
    const [anchor, setAnchor] = useState(null);

    if (!targets.length || !value) return null;

    const handleOpen = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    const handleSend = (route) => {
        sendTo(value, route);
        dispatch(push(route));
        handleClose();
    };

    return (
        <>
            <Button
                size="small"
                variant="outlined"
                startIcon={<CallSplit fontSize="small" />}
                onClick={handleOpen}
                sx={{
                    borderColor: "rgba(34,204,153,0.4)",
                    color: "#22cc99",
                    fontSize: "0.75rem",
                    "&:hover": { borderColor: "#22cc99", background: "rgba(34,204,153,0.08)" }
                }}
            >
                Send to…
            </Button>

            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
                transformOrigin={{ vertical: "top", horizontal: "left" }}
                PaperProps={{
                    sx: {
                        mt: 0.5,
                        minWidth: 220,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "10px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.35)"
                    }
                }}
            >
                <Paper elevation={0} sx={{ background: "transparent" }}>
                    <Typography variant="caption" sx={{ px: 2, pt: 1.5, pb: 0.5, display: "block", fontWeight: 700, color: "text.secondary" }}>
                        SEND OUTPUT TO
                    </Typography>
                    <MenuList dense>
                        {targets.map((t) => (
                            <MenuItem key={t.route} onClick={() => handleSend(t.route)} sx={{ "&:hover": { background: "rgba(34,204,153,0.08)" } }}>
                                {t.icon && <ListItemIcon sx={{ color: "#22cc99", minWidth: 32 }}>{t.icon}</ListItemIcon>}
                                <ListItemText primary={t.label} primaryTypographyProps={{ fontSize: "0.85rem" }} />
                            </MenuItem>
                        ))}
                    </MenuList>
                </Paper>
            </Popover>
        </>
    );
}
