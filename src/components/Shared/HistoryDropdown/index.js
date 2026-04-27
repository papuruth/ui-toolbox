import PropTypes from "prop-types";
import { Delete, History, RestoreOutlined } from "@mui/icons-material";
import { Box, IconButton, List, ListItem, ListItemButton, ListItemText, Popover, Tooltip, Typography } from "@mui/material";
import React, { useState } from "react";

/**
 * M6 — Shared history panel.
 * Renders a History icon button that opens a popover with recent entries.
 * On entry click calls onSelect(value).
 */
export default function HistoryDropdown({ history, onSelect, onClear }) {
    const [anchor, setAnchor] = useState(null);

    const handleOpen = (e) => setAnchor(e.currentTarget);
    const handleClose = () => setAnchor(null);

    const handleSelect = (value) => {
        onSelect(value);
        handleClose();
    };

    if (!history || history.length === 0) return null;

    return (
        <>
            <Tooltip title="Recent inputs">
                <IconButton size="small" onClick={handleOpen} sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#22cc99" } }}>
                    <History fontSize="small" />
                </IconButton>
            </Tooltip>

            <Popover
                open={Boolean(anchor)}
                anchorEl={anchor}
                onClose={handleClose}
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                transformOrigin={{ vertical: "top", horizontal: "right" }}
                PaperProps={{
                    sx: {
                        mt: 0.5,
                        minWidth: 280,
                        maxWidth: 400,
                        background: "var(--bg-card)",
                        border: "1px solid var(--border-color)",
                        borderRadius: "10px",
                        boxShadow: "0 8px 30px rgba(0,0,0,0.35)"
                    }
                }}
            >
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", px: 2, pt: 1.5, pb: 0.5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.75 }}>
                        <RestoreOutlined sx={{ fontSize: "0.95rem", color: "#22cc99" }} />
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                            RECENT INPUTS
                        </Typography>
                    </Box>
                    {onClear && (
                        <Tooltip title="Clear history">
                            <IconButton size="small" onClick={onClear} sx={{ color: "rgba(255,255,255,0.3)", "&:hover": { color: "#f44336" } }}>
                                <Delete sx={{ fontSize: "0.85rem" }} />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>

                <List dense disablePadding sx={{ maxHeight: 260, overflow: "auto" }}>
                    {history.map((entry, i) => (
                        // eslint-disable-next-line react/no-array-index-key
                        <ListItem key={i} disablePadding>
                            <ListItemButton
                                onClick={() => handleSelect(entry)}
                                sx={{
                                    px: 2,
                                    py: 0.75,
                                    "&:hover": { background: "rgba(34,204,153,0.08)" }
                                }}
                            >
                                <ListItemText
                                    primary={String(entry).length > 60 ? `${String(entry).slice(0, 60)}…` : entry}
                                    primaryTypographyProps={{
                                        variant: "caption",
                                        sx: { fontFamily: "monospace", color: "var(--text-primary)" }
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    ))}
                </List>
            </Popover>
        </>
    );
}

HistoryDropdown.propTypes = {
    history: PropTypes.arrayOf(PropTypes.string),
    onSelect: PropTypes.func.isRequired,
    onClear: PropTypes.func
};

HistoryDropdown.defaultProps = {
    history: [],
    onClear: null
};
