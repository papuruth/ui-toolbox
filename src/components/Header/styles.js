import { Box, InputBase } from "@mui/material";
import styled from "styled-components";
import { alpha, styled as muiStyled } from "@mui/material/styles";

export const StyledContainer = styled(Box)`
    width: 100%;
`;

export const ClearIconWrapper = styled.div`
    position: absolute;
    right: 7px;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
    height: 100%;
`;

export const Search = muiStyled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 0.15),
    "&:hover": {
        backgroundColor: alpha(theme.palette.common.white, 0.25)
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    [theme.breakpoints.up("xs")]: {
        marginRight: 0
    },
    [theme.breakpoints.up("sm")]: {
        marginLeft: theme.spacing(3),
        width: "auto"
    }
}));

export const SearchIconWrapper = muiStyled("div")(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: "100%",
    position: "absolute",
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
    justifyContent: "center"
}));

export const StyledInputBase = muiStyled(InputBase)(({ theme }) => ({
    color: "inherit",
    "& .MuiInputBase-input": {
        padding: theme.spacing(1, 1, 1, 0),
        // vertical padding + font size from searchIcon
        paddingLeft: `calc(1em + ${theme.spacing(4)})`,
        paddingRight: `calc(1em + ${theme.spacing(3)})`,
        transition: theme.transitions.create("width"),
        width: "100%",
        [theme.breakpoints.up("md")]: {
            width: "20ch"
        }
    }
}));

// ── Premium Command Palette Trigger ──────────────────────────────────────────
export const PaletteTrigger = muiStyled("button")(({ theme }) => {
    const isDark = theme.palette.mode === "dark";
    return {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "7px 14px 7px 12px",
        background: isDark ? "rgba(255,255,255,0.07)" : "rgba(255,255,255,0.18)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.14)" : "rgba(255,255,255,0.4)"}`,
        borderRadius: "10px",
        cursor: "pointer",
        color: isDark ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.95)",
        fontFamily: "Inter, sans-serif",
        fontSize: "0.82rem",
        transition: "background 0.18s ease, border-color 0.18s ease, box-shadow 0.18s ease, color 0.18s ease, width 0.2s ease",
        outline: "none",
        userSelect: "none",
        width: 240,
        minWidth: 40,
        boxShadow: isDark ? "inset 0 1px 0 rgba(255,255,255,0.05)" : "inset 0 1px 0 rgba(255,255,255,0.3), 0 1px 3px rgba(0,0,0,0.1)",

        "&:hover": {
            background: isDark ? "rgba(255,255,255,0.11)" : "rgba(255,255,255,0.28)",
            borderColor: isDark ? "rgba(34,204,153,0.5)" : "rgba(255,255,255,0.65)",
            boxShadow: isDark ? "0 0 0 3px rgba(34,204,153,0.12), inset 0 1px 0 rgba(255,255,255,0.07)" : "0 0 0 3px rgba(255,255,255,0.18)",
            color: isDark ? "rgba(255,255,255,0.88)" : "#fff",
            width: 280
        },

        "&:focus-visible": {
            borderColor: "rgba(34,204,153,0.65)",
            boxShadow: "0 0 0 3px rgba(34,204,153,0.22)",
            outline: "none",
            width: 280
        },

        [theme.breakpoints.down("sm")]: {
            minWidth: 40,
            width: "auto",
            padding: "6px 8px",
            "&:hover": {
                width: "auto"
            },
            "&:focus-visible": {
                width: "auto"
            }
        }
    };
});

export const TriggerPlaceholder = muiStyled("span")(({ theme }) => ({
    flex: 1,
    textAlign: "left",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",

    [theme.breakpoints.down("sm")]: {
        display: "none"
    }
}));

export const TriggerKbdGroup = muiStyled("span")(({ theme }) => ({
    display: "flex",
    alignItems: "center",
    gap: "3px",
    marginLeft: "auto",
    paddingLeft: "8px",
    flexShrink: 0,

    [theme.breakpoints.down("sm")]: {
        display: "none"
    }
}));

export const TriggerKbd = muiStyled("kbd")(({ theme }) => {
    const isDark = theme.palette.mode === "dark";
    return {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 6px",
        background: isDark ? "rgba(255,255,255,0.1)" : "rgba(255,255,255,0.25)",
        border: `1px solid ${isDark ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)"}`,
        borderRadius: "5px",
        fontFamily: "monospace",
        fontSize: "0.68rem",
        color: isDark ? "rgba(255,255,255,0.55)" : "rgba(255,255,255,0.9)",
        lineHeight: 1.6
    };
});

// ── Nav divider between logo/nav and utilities ────────────────────────────────
export const NavDivider = muiStyled("span")(() => ({
    width: "1px",
    height: "20px",
    background: "rgba(255,255,255,0.15)",
    margin: "0 12px",
    flexShrink: 0
}));

// ── Blog / Guides nav link ─────────────────────────────────────────────────────
export const BlogNavLink = muiStyled("button")(({ $active }) => ({
    display: "inline-flex",
    alignItems: "center",
    gap: "5px",
    background: $active ? "rgba(34,204,153,0.12)" : "none",
    border: $active ? "1px solid rgba(34,204,153,0.35)" : "1px solid transparent",
    borderRadius: "8px",
    padding: "5px 11px",
    cursor: "pointer",
    fontFamily: "Inter, sans-serif",
    fontSize: "0.82rem",
    fontWeight: 600,
    color: $active ? "#22cc99" : "rgba(255,255,255,0.65)",
    letterSpacing: "0.01em",
    transition: "color 0.17s ease, background 0.17s ease, border-color 0.17s ease",
    outline: "none",
    position: "relative",
    flexShrink: 0,

    // active bottom accent line
    "&::after": {
        content: "\"\"",
        position: "absolute",
        bottom: "-1px",
        left: "50%",
        transform: $active ? "translateX(-50%) scaleX(1)" : "translateX(-50%) scaleX(0)",
        width: "60%",
        height: "2px",
        borderRadius: "2px",
        background: "#22cc99",
        transition: "transform 0.2s ease"
    },

    "&:hover": {
        color: "#22cc99",
        background: "rgba(34,204,153,0.08)",
        borderColor: "rgba(34,204,153,0.25)",
        "&::after": {
            transform: "translateX(-50%) scaleX(1)"
        }
    },

    "&:active": {
        opacity: 0.8
    }
}));
