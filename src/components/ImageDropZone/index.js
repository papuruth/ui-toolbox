import React from "react";
import { useDropzone } from "react-dropzone";
import { FileUpload } from "@mui/icons-material";
import { func, bool, number, string } from "prop-types";
import { Typography } from "@mui/material";
import { StyledPaper } from "./styles";

export default function ImageDropZone({ handleOnDrop, maxImageSize, unit, fullWidth }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleOnDrop });

    return (
        <StyledPaper {...getRootProps()} $isDragActive={isDragActive} $fullWidth={fullWidth}>
            <input {...getInputProps()} accept=".jpg,.png,.jpeg" />
            <FileUpload sx={{ fontSize: 28, color: isDragActive ? "#22cc99" : "var(--text-secondary)", transition: "color 0.2s ease" }} />
            <Typography
                variant="body2"
                sx={{ color: isDragActive ? "#22cc99" : "var(--text-secondary)", fontWeight: 500, transition: "color 0.2s ease", fontSize: "13px" }}
            >
                {isDragActive ? "Drop it here" : "Drag & drop or click to upload"}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-secondary)", opacity: 0.5, fontSize: "11px" }}>
                JPG, PNG, JPEG · Max {maxImageSize} {unit}
            </Typography>
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
