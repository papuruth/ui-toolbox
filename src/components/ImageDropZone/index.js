import React from "react";
import { useDropzone } from "react-dropzone";
import { FileUpload } from "@mui/icons-material";
import { func, number, string } from "prop-types";
import { Typography } from "@mui/material";
import colors from "styles/colors";
import { StyledPaper } from "./styles";

export default function ImageDropZone({ handleOnDrop, maxImageSize, unit }) {
    const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleOnDrop });

    return (
        <StyledPaper {...getRootProps()}>
            <input {...getInputProps()} accept=".jpg,.png,.jpeg" />
            <FileUpload fontSize="large" />
            {isDragActive ? <p>Drop the image here</p> : <p>Drag & drop an image, or click to select</p>}
            <Typography variant="h6" sx={{ color: colors.dark }}>
                Max {maxImageSize} {unit}
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
