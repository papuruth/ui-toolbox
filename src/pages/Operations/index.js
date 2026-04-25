import AspectRatioCalculator from "components/AspectRatioCalculator";
import Base64Image from "components/Base64Image";
import Base64Text from "components/Base64Text";
import ColorConverter from "components/ColorConverter";
import CSVToJSON from "components/CSVToJSON";
import HashGenerator from "components/HashGenerator";
import ImageResizer from "components/ImageResizer";
import JWTDecoder from "components/JWTDecoder";
import LoremIpsum from "components/LoremIpsum";
import NumberBaseConverter from "components/NumberBaseConverter";
import PasswordTools from "components/PasswordTools";
import QRGenerator from "components/QRGenerator";
import RegexTester from "components/RegexTester";
import TextCaseConverter from "components/TextCaseConverter";
import TextDiff from "components/TextDiff";
import TimestampConverter from "components/TimestampConverter";
import UUIDGenerator from "components/UUIDGenerator";
import WordCounter from "components/WordCounter";
import YAMLJSONConverter from "components/YAMLJSONConverter";
import { Box, Chip, Typography } from "@mui/material";
import { object, oneOfType } from "prop-types";
import React, { useEffect } from "react";
import StepperNavigation from "components/StepperNavigation";
import UrlValidator from "components/UrlValidator";
import localization from "localization";
import URLShortner from "components/URLShortner";
import JSONViewer from "components/JSONViewer";
import { GLOBAL_CONSTANTS, TOOL_CATEGORIES } from "utils/globalConstants";
import storage from "utils/storage";
import { StyledHeroContent, StyledToolBody, StyledToolCard, StyledToolHero, StyledToolPage } from "./styles";

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

    return (
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
                    <Component />
                </StyledToolCard>
            </StyledToolBody>
        </StyledToolPage>
    );
}

Operations.propTypes = {
    location: oneOfType([object]).isRequired
};

export default Operations;
