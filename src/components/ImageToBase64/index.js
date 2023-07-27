import { CloudDownload, ContentCopy, Image } from '@mui/icons-material';
import { Box, IconButton, TextField, Toolbar, Tooltip, Typography } from '@mui/material';
import ImageDropZone from 'components/ImageDropZone';
import React, { useCallback, useState } from 'react';
import colors from 'styles/colors';
import toast from 'utils/toast';
import { StyledBoxCenter, StyledBoxContainer, StyledImagePreviewContainer, StyledImageRenderer } from 'components/Shared/Styled-Components';
import { downloadFile, getDataUrl } from 'utils/helperFunctions';
import topLoader from 'utils/topLoader';

export default function ImageToBase64() {
  const [imageBase64, setImageBase64] = useState('');
  const [htmlImageCode, setHTMLImageCode] = useState('');
  const [cssBgImage, setCSSBGImage] = useState('');
  const [copyTooltip, setCopyTooltip] = useState('Copy to clipboard');
  const [filename, setFilename] = useState('');

  const handleSelectedFiles = useCallback((acceptedFiles) => {
    const loaderId = Date.now();
    try {
      acceptedFiles.forEach(async (file) => {
        if (Math.floor(file.size / 1024 / 1024) > 2) {
          toast.error('Maximum image size allowed is 2MB');
          return;
        }
        topLoader.show(true, loaderId);
        let truncateName = file.name.split('.');
        truncateName.pop();
        truncateName = truncateName.join('.');
        setFilename(truncateName);
        const imageDataUrl = await getDataUrl(file);
        setImageBase64(imageDataUrl);
        const htmlIMG = `<img src='${imageDataUrl}' />`;
        setHTMLImageCode(htmlIMG);
        const cssBGCode = `background-image: url(${imageDataUrl})`;
        setCSSBGImage(cssBGCode);
        topLoader.hide(true, loaderId);
      });
    } catch (error) {
      console.log('Image Load Error', error);
      topLoader.hide(true, loaderId);
    }
  }, []);

  const handleDownload = useCallback(
    (type) => {
      let downloadUrl = `data:text/plain;charset=utf-8,${encodeURIComponent(imageBase64)}`;
      let downloadFilename = `${filename}.txt`;
      if (type === 'html') {
        downloadUrl = `data:text/html;charset=utf-8,${encodeURIComponent(htmlImageCode)}`;
        downloadFilename = `${filename}.html`;
      } else if (type === 'css') {
        downloadUrl = `data:text/css;charset=utf-8,${encodeURIComponent(cssBgImage)}`;
        downloadFilename = `${filename}.css`;
      }
      downloadFile(downloadUrl, downloadFilename);
    },
    [filename, htmlImageCode, imageBase64, cssBgImage],
  );

  const handleCopyToClipBoard = useCallback(
    (type) => {
      let data = imageBase64;
      if (type === 'html') {
        data = htmlImageCode;
      } else if (type === 'css') {
        data = cssBgImage;
      }
      if (window && window.navigator.clipboard) {
        window.navigator.clipboard.writeText(data).then(() => {
          setCopyTooltip('Copied!');
          setTimeout(() => {
            setCopyTooltip('Copy to clipboard');
          }, 1000);
        });
      }
    },
    [imageBase64, htmlImageCode, cssBgImage],
  );

  return (
    <>
      <ImageDropZone handleOnDrop={handleSelectedFiles} />
      <Box sx={{ display: 'flex', width: '100%', border: '1px solid #000', borderRadius: 2, mt: 10 }}>
        <StyledImagePreviewContainer borderRight>
          {imageBase64 ? (
            <StyledImageRenderer src={imageBase64} alt="image-preview" />
          ) : (
            <StyledBoxCenter justifyContent="center">
              <Image fontSize="large" />
              <Typography variant="h6">Image Preview</Typography>
            </StyledBoxCenter>
          )}
        </StyledImagePreviewContainer>
        <StyledBoxContainer width="50%" padding="20px" display="block !important">
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="p" color={colors.primary} fontWeight={700} flexGrow={1}>
              Base64 Strings
            </Typography>
            <Typography component="p" color={colors.secondary} fontWeight={400}>
              Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {imageBase64.length} chars
            </Typography>
            {imageBase64.length > 0 ? (
              <Toolbar>
                <Tooltip title="Download">
                  <IconButton onClick={() => handleDownload('base64')}>
                    <CloudDownload color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copyTooltip}>
                  <IconButton onClick={() => handleCopyToClipBoard('base64')}>
                    <ContentCopy color="primary" />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            ) : null}
          </Box>
          <TextField
            id="image-base64"
            placeholder="Base64 Strings"
            multiline
            rows={7}
            sx={{ width: '100%', mb: 3 }}
            value={imageBase64}
            inputProps={{ readOnly: true }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="h5" color={colors.primary} fontWeight={700} flexGrow={1}>
              HTML {'<img />'} code
            </Typography>
            <Typography component="p" color={colors.secondary} fontWeight={400}>
              Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {htmlImageCode.length} chars
            </Typography>
            {imageBase64.length > 0 ? (
              <Toolbar>
                <Tooltip title="Download">
                  <IconButton onClick={() => handleDownload('html')}>
                    <CloudDownload color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copyTooltip}>
                  <IconButton onClick={() => handleCopyToClipBoard('html')}>
                    <ContentCopy color="primary" />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            ) : null}
          </Box>
          <TextField
            id="html-img"
            placeholder="HTML <img /> code"
            multiline
            rows={7}
            sx={{ width: '100%', mb: 3 }}
            value={htmlImageCode}
            inputProps={{ readOnly: true }}
          />
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography component="h5" color={colors.primary} fontWeight={700} flexGrow={1}>
              CSS Background Source
            </Typography>
            <Typography component="p" color={colors.secondary} fontWeight={400}>
              Size: {imageBase64 ? (imageBase64.length / 1024).toFixed(2) : 0} KB, {cssBgImage.length} chars
            </Typography>
            {imageBase64.length > 0 ? (
              <Toolbar>
                <Tooltip title="Download">
                  <IconButton onClick={() => handleDownload('css')}>
                    <CloudDownload color="primary" />
                  </IconButton>
                </Tooltip>
                <Tooltip title={copyTooltip}>
                  <IconButton onClick={() => handleCopyToClipBoard('css')}>
                    <ContentCopy color="primary" />
                  </IconButton>
                </Tooltip>
              </Toolbar>
            ) : null}
          </Box>
          <TextField
            id="image-css"
            placeholder="CSS Background Source"
            multiline
            rows={7}
            sx={{ width: '100%' }}
            value={cssBgImage}
            inputProps={{ readOnly: true }}
          />
        </StyledBoxContainer>
      </Box>
    </>
  );
}
