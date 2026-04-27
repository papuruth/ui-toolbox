import React from "react";
import { useDropzone } from "react-dropzone";
import { FileUpload } from "@mui/icons-material";
import { func, number, string } from "prop-types";
import { Typography } from "@mui/material";
import { StyledPaper } from "./styles";

export default function ImageDropZone({ handleOnDrop, maxImageSize, unit }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleOnDrop });

    return (
        <StyledPaper {...getRootProps()} $isDragActive={isDragActive}>
            <input {...getInputProps()} accept=".jpg,.png,.jpeg" />
            <FileUpload fontSize="large" color={isDragActive ? "primary" : "action"} />
            {isDragActive ? <p>Drop the image here</p> : <p>Drag & drop an image, or click to select</p>}
            <Typography variant="subtitle2" sx={{ color: "var(--text-primary)" }}>
                Max {maxImageSize} {unit}
            </Typography>
            <Typography variant="caption" sx={{ color: "var(--text-secondary)" }}>
                Supports JPG, PNG, JPEG
            </Typography>
        </StyledPaper>
    );
}

ImageDropZone.defaultProps = {
    maxImageSize: 2,
    unit: "MB"
};

ImageDropZone.propTypes = {
    handleOnDrop: func.isRequired,
    maxImageSize: number,
    unit: string
};
