import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { FileUpload } from "@mui/icons-material";
import { func, bool, number, string } from "prop-types";
import { Typography } from "@mui/material";
import { StyledPaper } from "./styles";

const ACCEPTED_TYPES = {
    "image/jpeg": [".jpg", ".jpeg"],
    "image/png": [".png"]
};

export default function ImageDropZone({ handleOnDrop, maxImageSize, unit, fullWidth }) {
    const [dropError, setDropError] = useState("");

    const onDrop = useCallback((acceptedFiles) => {
        setDropError("");
        handleOnDrop(acceptedFiles);
    }, [handleOnDrop]);

    const onDropRejected = useCallback(() => {
        setDropError("Invalid file type. Please upload a JPG, PNG, or JPEG image.");
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        onDropRejected,
        accept: ACCEPTED_TYPES
    });

    return (
        <StyledPaper {...getRootProps()} $isDragActive={isDragActive} $fullWidth={fullWidth} data-drag-active={isDragActive}>
            <input {...getInputProps()} />
            <FileUpload className="upload-icon" sx={{ fontSize: 28, color: isDragActive ? "#22cc99" : "var(--text-secondary)", transition: "color 0.2s ease" }} />
            <Typography
                variant="body2"
                sx={{ color: isDragActive ? "#22cc99" : "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s ease", fontSize: "13px" }}
            >
                {isDragActive ? "Drop it here" : "Drag & drop or click to upload"}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-secondary)", opacity: 0.5, fontSize: "11px" }}>
                JPG, PNG, JPEG · Max {maxImageSize} {unit}
            </Typography>
            {dropError && (
                <Typography variant="caption" sx={{ color: "#ff5252", fontSize: "11px", mt: 0.5 }}>
                    {dropError}
                </Typography>
            )}
        </StyledPaper>
    );
}

ImageDropZone.defaultProps = {
    maxImageSize: 2,
    unit: "MB",
    fullWidth: false
};

ImageDropZone.propTypes = {
    handleOnDrop: func.isRequired,
    maxImageSize: number,
    unit: string,
    fullWidth: bool
};
