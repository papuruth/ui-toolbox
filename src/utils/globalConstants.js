import {
    Analytics,
    AspectRatio,
    Calculate,
    Code,
    ContentCut,
    CropFree,
    DataObject,
    Difference,
    FormatSize,
    Http,
    Link as LinkIcon,
    Lock,
    Notes,
    Palette,
    Password,
    PhotoLibrary,
    QrCode,
    Schedule,
    Search,
    SwapHoriz,
    TableChart,
    Tag,
    VpnKey
} from "@mui/icons-material";
import localization from "localization";
import React from "react";

const {
    base64Image,
    base64Text,
    qrGenerator,
    imageResizer,
    aspectRatioCalculator,
    urlValidator,
    urlShortner,
    jsonViewer,
    passwordTools,
    colorConverter,
    textCaseConverter,
    hashGenerator,
    regexTester,
    jwtDecoder,
    uuidGenerator,
    timestampConverter,
    numberBaseConverter,
    yamlJsonConverter,
    textDiff,
    loremIpsum,
    wordCounter,
    csvToJson,
    apiRequestBuilder
} = localization;

export const TOOL_CATEGORIES = [
    { id: "image", label: "Image Tools", color: "#22cc99" },
    { id: "encoding", label: "Encoding & Text", color: "#2299ff" },
    { id: "url", label: "URL & Web", color: "#ff9800" },
    { id: "utilities", label: "Utilities", color: "#9c27b0" },
    { id: "developer", label: "Developer Tools", color: "#e91e63" }
];

export const GLOBAL_CONSTANTS = {
    OPERATIONS_ITEMS: [
        {
            label: base64Image.pageTitle,
            route: "/base64-image",
            description: "Convert images to Base64 and decode Base64 back to image",
            category: "image",
            badge: null,
            icon: (
                <PhotoLibrary
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: qrGenerator.pageTitle,
            route: "/qr-generator",
            description: "Generate QR codes from any text, with optional logo overlay",
            category: "image",
            badge: "popular",
            icon: (
                <QrCode
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: imageResizer.pageTitle,
            route: "/image-resizer",
            description: "Crop, scale, and rotate images with a live preview canvas",
            category: "image",
            badge: null,
            icon: (
                <CropFree
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: aspectRatioCalculator.pageTitle,
            route: "/aspect-ratio-calculator",
            description: "Calculate and copy the simplified aspect ratio of any image",
            category: "image",
            badge: null,
            icon: (
                <AspectRatio
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: base64Text.pageTitle,
            route: "/base64-text",
            description: "Encode plain text to Base64 and decode Base64 back to text",
            category: "encoding",
            badge: null,
            icon: (
                <DataObject
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: urlValidator.pageTitle,
            route: "/url-validator",
            description: "Check HTTP status codes and strip tracking parameters from URLs",
            category: "url",
            badge: "popular",
            icon: (
                <LinkIcon
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: urlShortner.pageTitle,
            route: "/url-shortener",
            description: "Shorten any long URL to a compact shareable link",
            category: "url",
            badge: null,
            icon: (
                <ContentCut
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: passwordTools.pageTitle,
            route: "/password-tools",
            description: "Generate secure passwords and analyze strength with crack-time estimation",
            category: "utilities",
            badge: "popular",
            icon: (
                <Password
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: jsonViewer.pageTitle,
            route: "/json-viewer",
            description: "Format, validate, and interactively browse JSON data",
            category: "utilities",
            badge: "popular",
            icon: (
                <Code
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: colorConverter.pageTitle,
            route: "/color-converter",
            description: "Convert colors between HEX, RGB, and HSL formats instantly",
            category: "utilities",
            badge: null,
            icon: (
                <Palette
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: textCaseConverter.pageTitle,
            route: "/text-case",
            description: "Transform text to UPPER, lower, Title, camelCase, snake_case and more",
            category: "encoding",
            badge: null,
            icon: (
                <FormatSize
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: hashGenerator.pageTitle,
            route: "/hash-generator",
            description: "Generate MD5, SHA-1, SHA-256, and SHA-512 hashes from any text",
            category: "encoding",
            badge: null,
            icon: (
                <Lock
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: regexTester.pageTitle,
            route: "/regex-tester",
            description: "Test regular expressions with live match highlighting and group capture",
            category: "encoding",
            badge: null,
            icon: (
                <Search
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: jwtDecoder.pageTitle,
            route: "/jwt-decoder",
            description: "Decode and inspect JWT token header and payload without verification",
            category: "encoding",
            badge: null,
            icon: (
                <VpnKey
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: uuidGenerator.pageTitle,
            route: "/uuid-generator",
            description: "Generate one or more UUID v4 values with a single click",
            category: "utilities",
            badge: null,
            icon: (
                <Tag
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: timestampConverter.pageTitle,
            route: "/timestamp",
            description: "Convert Unix timestamps to human-readable dates and vice versa",
            category: "utilities",
            badge: null,
            icon: (
                <Schedule
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: numberBaseConverter.pageTitle,
            route: "/number-base",
            description: "Convert numbers between binary, octal, decimal, and hexadecimal",
            category: "utilities",
            badge: null,
            icon: (
                <Calculate
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: yamlJsonConverter.pageTitle,
            route: "/yaml-json",
            description: "Convert YAML to JSON and JSON to YAML with error feedback",
            category: "encoding",
            badge: null,
            icon: (
                <SwapHoriz
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: textDiff.pageTitle,
            route: "/text-diff",
            description: "Compare two text blocks and highlight added and removed words",
            category: "encoding",
            badge: null,
            icon: (
                <Difference
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: loremIpsum.pageTitle,
            route: "/lorem-ipsum",
            description: "Generate lorem ipsum placeholder text by paragraphs, sentences, or words",
            category: "utilities",
            badge: null,
            icon: (
                <Notes
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: wordCounter.pageTitle,
            route: "/word-counter",
            description: "Count words, characters, lines, sentences, paragraphs and reading time",
            category: "encoding",
            badge: null,
            icon: (
                <Analytics
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: csvToJson.pageTitle,
            route: "/csv-json",
            description: "Parse CSV data into JSON with configurable header row support",
            category: "encoding",
            badge: null,
            icon: (
                <TableChart
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        },
        {
            label: apiRequestBuilder.pageTitle,
            route: "/api-builder",
            description: "Build and test HTTP requests directly in your browser with a full-featured request editor",
            category: "developer",
            badge: "new",
            icon: (
                <Http
                    fontSize="large"
                    sx={{ fontSize: "5rem", width: { xs: "0.5em", sm: "0.5em", md: "1em" }, height: { xs: "0.5em", sm: "0.5em", md: "1em" } }}
                />
            )
        }
    ],
    PASSWORD_GEN_LIST: {
        Uppers: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
        Lowers: "abcdefghijklmnopqrstuvwxyz",
        Numbers: "1234567890",
        Symbols: "!#$%&*+-.@^_~%()=`"
    },
    JSON_EDITOR_CTA: [
        {
            id: "paste",
            label: "Paste",
            enabled: true
        },
        {
            id: "copy",
            label: "Copy",
            enabled: true
        },
        {
            id: "clear",
            label: "Clear",
            enabled: true
        },
        {
            id: "format",
            label: "Format",
            enabled: true
        },
        {
            id: "removeWhitespace",
            label: "Remove Whitespace",
            enabled: true
        },
        {
            id: "loadJSONData",
            label: "Load JSON Data",
            enabled: true
        }
    ],
    GIT_REPO_URL: "https://github.com/papuruth/devdeck",
    APP_CREATED_YEAR: 2023
};
