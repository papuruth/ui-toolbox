import PropTypes from "prop-types";
import { IosShare } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

/**
 * M8 — ShareButton
 * Encodes the current tool value into the URL and copies it to clipboard.
 * @param {Function} onShare  Callback that encodes + copies the URL (from useShareableURL)
 * @param {boolean} disabled
 */
export default function ShareButton({ onShare, disabled = false }) {
    return (
        <Tooltip title="Copy shareable link">
            <span>
                <IconButton
                    size="small"
                    disabled={disabled}
                    onClick={onShare}
                    sx={{
                        color: disabled ? "rgba(255,255,255,0.2)" : "rgba(255,255,255,0.5)",
                        "&:hover": { color: "#22cc99" }
                    }}
                >
                    <IosShare fontSize="small" />
                </IconButton>
            </span>
        </Tooltip>
    );
}

ShareButton.propTypes = {
    onShare: PropTypes.func.isRequired,
    disabled: PropTypes.bool
};

ShareButton.defaultProps = {
    disabled: false
};
