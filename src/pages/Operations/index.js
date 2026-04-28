import { Box, Chip, CircularProgress, Typography } from "@mui/material";
import { object, oneOfType } from "prop-types";
import React, { Suspense, lazy, useEffect } from "react";
import StepperNavigation from "components/StepperNavigation";
import localization from "localization";
import { GLOBAL_CONSTANTS, TOOL_CATEGORIES } from "utils/globalConstants";
import storage from "utils/storage";
import ToolSEO from "components/Shared/ToolSEO";
import RelatedTools from "components/Shared/RelatedTools";
import { SEO_META } from "utils/seoMeta";
import { StyledHeroContent, StyledToolBody, StyledToolCard, StyledToolHero, StyledToolPage } from "./styles";

const AspectRatioCalculator = lazy(() => import("components/AspectRatioCalculator"));
const Base64Image = lazy(() => import("components/Base64Image"));
const Base64Text = lazy(() => import("components/Base64Text"));
const ColorConverter = lazy(() => import("components/ColorConverter"));
const CSVToJSON = lazy(() => import("components/CSVToJSON"));
const HashGenerator = lazy(() => import("components/HashGenerator"));
const ImageResizer = lazy(() => import("components/ImageResizer"));
const JWTDecoder = lazy(() => import("components/JWTDecoder"));
const JSONViewer = lazy(() => import("components/JSONViewer"));
const LoremIpsum = lazy(() => import("components/LoremIpsum"));
const NumberBaseConverter = lazy(() => import("components/NumberBaseConverter"));
const PasswordTools = lazy(() => import("components/PasswordTools"));
const QRGenerator = lazy(() => import("components/QRGenerator"));
const RegexTester = lazy(() => import("components/RegexTester"));
const TextCaseConverter = lazy(() => import("components/TextCaseConverter"));
const TextDiff = lazy(() => import("components/TextDiff"));
const TimestampConverter = lazy(() => import("components/TimestampConverter"));
const URLShortner = lazy(() => import("components/URLShortner"));
const UrlValidator = lazy(() => import("components/UrlValidator"));
const UUIDGenerator = lazy(() => import("components/UUIDGenerator"));
const WordCounter = lazy(() => import("components/WordCounter"));
const YAMLJSONConverter = lazy(() => import("components/YAMLJSONConverter"));

function ToolFallback() {
    return (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 200 }}>
            <CircularProgress size={32} sx={{ color: "var(--color-primary, #22c55e)" }} />
        </Box>
    );
}

function Operations({ location }) {
    const { pathname } = location || {};

    useEffect(() => {
        if (pathname) {
            storage.setRecentTool(pathname);
        }
    }, [pathname]);

    const renderComponentConditionally = () => {
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
            csvToJson
        } = localization;
        switch (pathname) {
            case "/base64-image":
                return { title: base64Image.pageTitle, component: Base64Image };
            case "/base64-text":
                return { title: base64Text.pageTitle, component: Base64Text };
            case "/qr-generator":
                return { title: qrGenerator.pageTitle, component: QRGenerator };
            case "/image-resizer":
                return { title: imageResizer.pageTitle, component: ImageResizer };
            case "/aspect-ratio-calculator":
                return { title: aspectRatioCalculator.pageTitle, component: AspectRatioCalculator };
            case "/url-validator":
                return { title: urlValidator.pageTitle, component: UrlValidator };
            case "/url-shortener":
                return { title: urlShortner.pageTitle, component: URLShortner };
            case "/json-viewer":
                return { title: jsonViewer.pageTitle, component: JSONViewer };
            case "/password-tools":
                return { title: passwordTools.pageTitle, component: PasswordTools };
            case "/color-converter":
                return { title: colorConverter.pageTitle, component: ColorConverter };
            case "/text-case":
                return { title: textCaseConverter.pageTitle, component: TextCaseConverter };
            case "/hash-generator":
                return { title: hashGenerator.pageTitle, component: HashGenerator };
            case "/regex-tester":
                return { title: regexTester.pageTitle, component: RegexTester };
            case "/jwt-decoder":
                return { title: jwtDecoder.pageTitle, component: JWTDecoder };
            case "/uuid-generator":
                return { title: uuidGenerator.pageTitle, component: UUIDGenerator };
            case "/timestamp":
                return { title: timestampConverter.pageTitle, component: TimestampConverter };
            case "/number-base":
                return { title: numberBaseConverter.pageTitle, component: NumberBaseConverter };
            case "/yaml-json":
                return { title: yamlJsonConverter.pageTitle, component: YAMLJSONConverter };
            case "/text-diff":
                return { title: textDiff.pageTitle, component: TextDiff };
            case "/lorem-ipsum":
                return { title: loremIpsum.pageTitle, component: LoremIpsum };
            case "/word-counter":
                return { title: wordCounter.pageTitle, component: WordCounter };
            case "/csv-json":
                return { title: csvToJson.pageTitle, component: CSVToJSON };
            default:
                return null;
        }
    };

    const toolMeta = renderComponentConditionally();
    if (!toolMeta) return null;
    const { title, component: Component } = toolMeta;

    const currentItem = GLOBAL_CONSTANTS.OPERATIONS_ITEMS.find((item) => item.route === pathname);
    const category = currentItem ? TOOL_CATEGORIES.find((c) => c.id === currentItem.category) : null;

    const toolSeo = SEO_META[pathname];

    return (
        <>
            <ToolSEO route={pathname} />
            <StyledToolPage>
            <StyledToolHero $categoryColor={category?.color}>
                <StepperNavigation currentView={title} category={category} />
                <StyledHeroContent>
                    <Box>
                        <Typography variant="h5" fontWeight={700} sx={{ lineHeight: 1.2 }}>
                            {title}
                        </Typography>
                        {currentItem?.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 540 }}>
                                {currentItem.description}
                            </Typography>
                        )}
                    </Box>
                    {category && (
                        <Chip
                            label={category.label}
                            size="small"
                            sx={{
                                bgcolor: `${category.color}22`,
                                color: category.color,
                                fontWeight: 600,
                                border: `1px solid ${category.color}55`,
                                alignSelf: "flex-start",
                                mt: 0.5
                            }}
                        />
                    )}
                </StyledHeroContent>
            </StyledToolHero>
            <StyledToolBody>
                <StyledToolCard elevation={2}>
                    <Suspense fallback={<ToolFallback />}>
                        <Component />
                    </Suspense>
                </StyledToolCard>
                {toolSeo?.about && (
                    <Box sx={{ mt: 3, px: 1 }}>
                        <Typography variant="subtitle2" fontWeight={700} gutterBottom sx={{ color: "var(--text-primary)" }}>
                            About this tool
                        </Typography>
                        <Typography variant="body2" sx={{ color: "var(--text-secondary)" }}>
                            {toolSeo.about}
                        </Typography>
                    </Box>
                )}
                <RelatedTools currentRoute={pathname} />
            </StyledToolBody>
        </StyledToolPage>
        </>
    );
}

Operations.propTypes = {
    location: oneOfType([object]).isRequired
};

export default Operations;
