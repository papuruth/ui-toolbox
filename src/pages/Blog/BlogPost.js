import React from "react";
import { useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import { Button } from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Typography from "@mui/material/Typography";
import ToolSEO from "components/Shared/ToolSEO";
import NoData from "components/Shared/NoData";
import blogData from "../../data/blogData";
import {
    BlogPageWrapper,
    BlogHero,
    BlogTitle,
    BlogIntro,
    BlogSection,
    BlogH2,
    BlogBody,
    BlogList,
    BlogSteps,
    BlogCTABox,
    BlogCTAHeading,
    BlogRelatedWrapper,
    BlogRelatedTitle,
    BlogRelatedGrid,
    BlogRelatedCard,
    BlogRelatedCardTitle,
    BlogRelatedCardDesc,
    BlogFAQWrapper,
    BlogFAQTitle
} from "./styles";

function renderSectionContent(section) {
    if (section.steps) {
        return (
            <BlogSteps>
                {section.steps.map((step) => (
                    <li key={step}>{step}</li>
                ))}
            </BlogSteps>
        );
    }
    if (section.list) {
        return (
            <BlogList>
                {section.list.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </BlogList>
        );
    }
    return <BlogBody>{section.body}</BlogBody>;
}

export default function BlogPost() {
    const { pathname } = useLocation();
    const dispatch = useDispatch();

    // Extract slug from /blog/:slug
    const slug = pathname.replace(/^\/blog\//, "");
    const post = blogData[slug];

    if (!post) {
        return <NoData />;
    }

    const route = `/blog/${slug}`;

    return (
        <BlogPageWrapper>
            <ToolSEO route={route} />

            <BlogHero>
                <BlogTitle>{post.title}</BlogTitle>
                <BlogIntro>{post.intro}</BlogIntro>
            </BlogHero>

            {post.sections.map((section) => (
                <BlogSection key={section.heading}>
                    <BlogH2>{section.heading}</BlogH2>
                    {renderSectionContent(section)}
                </BlogSection>
            ))}

            <BlogCTABox>
                <BlogCTAHeading>Ready to try it?</BlogCTAHeading>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => dispatch(push(post.cta.toolRoute))}
                    sx={{
                        background: "#22cc99",
                        color: "#000",
                        fontWeight: 700,
                        borderRadius: "var(--radius-btn, 6px)",
                        textTransform: "none",
                        fontSize: "1rem",
                        px: 4,
                        "&:hover": { background: "#1ab385" }
                    }}
                >
                    {post.cta.label}
                </Button>
            </BlogCTABox>

            {post.relatedSlugs && post.relatedSlugs.length > 0 && (
                <BlogRelatedWrapper>
                    <BlogRelatedTitle>Related Tools</BlogRelatedTitle>
                    <BlogRelatedGrid>
                        {post.relatedSlugs.map((relSlug) => {
                            const rel = blogData[relSlug];
                            if (!rel) return null;
                            return (
                                <BlogRelatedCard key={relSlug} elevation={0} onClick={() => dispatch(push(`/blog/${relSlug}`))}>
                                    <BlogRelatedCardTitle>{rel.title.split(" — ")[0]}</BlogRelatedCardTitle>
                                    <BlogRelatedCardDesc>{rel.intro.slice(0, 80)}…</BlogRelatedCardDesc>
                                </BlogRelatedCard>
                            );
                        })}
                    </BlogRelatedGrid>
                </BlogRelatedWrapper>
            )}

            {post.faq && post.faq.length > 0 && (
                <BlogFAQWrapper>
                    <BlogFAQTitle>Frequently Asked Questions</BlogFAQTitle>
                    {post.faq.map((item) => (
                        <Accordion
                            key={item.q}
                            elevation={0}
                            disableGutters
                            sx={{
                                background: "var(--bg-card)",
                                border: "1px solid var(--border-color)",
                                borderRadius: "8px !important",
                                mb: 1,
                                "&:before": { display: "none" },
                                "&.Mui-expanded": { mb: 1 }
                            }}
                        >
                            <AccordionSummary expandIcon={<ExpandMoreIcon sx={{ color: "#22cc99" }} />}>
                                <Typography sx={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "0.9375rem" }}>{item.q}</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography sx={{ color: "var(--text-secondary)", fontSize: "0.9375rem", lineHeight: 1.7 }}>{item.a}</Typography>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </BlogFAQWrapper>
            )}
        </BlogPageWrapper>
    );
}
