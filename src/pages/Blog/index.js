import React, { useState, useMemo } from "react";
import { useDispatch } from "react-redux";
import { push } from "connected-react-router";
import ToolSEO from "components/Shared/ToolSEO";
import { blogList } from "../../data/blogData";
import {
    BlogIndexWrapper,
    BlogIndexHero,
    BlogIndexTitle,
    BlogIndexSubtitle,
    BlogIndexGrid,
    BlogIndexCard,
    BlogIndexCardTitle,
    BlogIndexCardSnippet,
    BlogIndexCardLink,
    BlogIndexSearchWrapper,
    BlogIndexSearchInput,
    SectionLabel,
    FeaturedSection,
    FeaturedGrid,
    FeaturedHeroCard,
    FeaturedHeroLabel,
    FeaturedHeroTitle,
    FeaturedHeroSnippet,
    FeaturedHeroCTA,
    FeaturedSideCard,
    FeaturedSideTitle,
    FeaturedSideSnippet,
    CategoryBar,
    CategoryChip,
    CardMetaRow,
    CardTag,
    CardReadTime,
    PopularList,
    PopularRow,
    PopularRank,
    PopularRowContent,
    PopularRowTitle
} from "./styles";

const CATEGORY_MAP = {
    "api-request-builder": "Data",
    "json-viewer": "Data",
    "jwt-decoder": "Security",
    "base64-text-encoder": "Encoding",
    "base64-image-converter": "Encoding",
    "hash-generator": "Security",
    "password-generator": "Security",
    "uuid-generator": "Security",
    "regex-tester": "Text",
    "timestamp-converter": "Data",
    "number-base-converter": "Encoding",
    "csv-to-json-converter": "Data",
    "yaml-to-json-converter": "Data",
    "text-diff-checker": "Text",
    "text-case-converter": "Text",
    "word-counter": "Text",
    "lorem-ipsum-generator": "Text",
    "qr-code-generator": "Image",
    "url-shortener": "Encoding",
    "url-parser": "Encoding",
    "image-resizer": "Image",
    "color-converter": "Image",
    "aspect-ratio-calculator": "Image"
};

const CATEGORY_COLORS = {
    Data: { color: "#2299ff", bg: "rgba(34,153,255,0.1)" },
    Security: { color: "#ef4444", bg: "rgba(239,68,68,0.1)" },
    Encoding: { color: "#fbbf24", bg: "rgba(251,191,36,0.1)" },
    Text: { color: "#818cf8", bg: "rgba(129,140,248,0.1)" },
    Image: { color: "#22cc99", bg: "rgba(34,204,153,0.1)" }
};

const CATEGORIES = ["All", "Data", "Security", "Encoding", "Text", "Image"];

const POPULAR_SLUGS = ["json-viewer", "jwt-decoder", "base64-text-encoder", "regex-tester", "uuid-generator"];

function getSectionLabel(category) {
    return category === "All" ? "All Guides" : `${category} Guides`;
}

function getReadingTime(post) {
    const text = [
        post.intro,
        ...(post.sections || []).map((s) =>
            [s.body || "", ...(s.list || []), ...(s.steps || [])].join(" ")
        )
    ].join(" ");
    const words = text.trim().split(/\s+/).length;
    return Math.max(1, Math.round(words / 200));
}

export default function BlogIndex() {
    const dispatch = useDispatch();
    const [search, setSearch] = useState("");
    const [activeCategory, setActiveCategory] = useState("All");

    const featured = blogList.slice(0, 3);

    const popularPosts = useMemo(
        () => POPULAR_SLUGS.map((slug) => blogList.find((p) => p.slug === slug)).filter(Boolean),
        []
    );

    const filtered = useMemo(() => {
        const q = search.toLowerCase();
        return blogList.slice(3).filter((post) => {
            const matchesCategory =
                activeCategory === "All" || CATEGORY_MAP[post.slug] === activeCategory;
            const matchesSearch =
                !q ||
                post.title.toLowerCase().includes(q) ||
                post.intro.toLowerCase().includes(q);
            return matchesCategory && matchesSearch;
        });
    }, [activeCategory, search]);

    const navigate = (slug) => dispatch(push(`/blog/${slug}`));

    return (
        <BlogIndexWrapper>
            <ToolSEO route="/blog" />

            {/* ── Header ─────────────────────────────────────────── */}
            <BlogIndexHero>
                <BlogIndexTitle>DevDeck Guides</BlogIndexTitle>
                <BlogIndexSubtitle>Learn faster. Build smarter.</BlogIndexSubtitle>
                <BlogIndexSearchWrapper>
                    <BlogIndexSearchInput
                        placeholder="Search guides..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            if (e.target.value) setActiveCategory("All");
                        }}
                    />
                </BlogIndexSearchWrapper>
            </BlogIndexHero>

            {/* ── Featured Guides ─────────────────────────────────── */}
            {!search && (
                <FeaturedSection>
                    <SectionLabel>Featured Guides</SectionLabel>
                    <FeaturedGrid>
                        <FeaturedHeroCard elevation={0} onClick={() => navigate(featured[0].slug)}>
                            <FeaturedHeroLabel>Featured</FeaturedHeroLabel>
                            <FeaturedHeroTitle>
                                {featured[0].title.split(" — ")[0]}
                            </FeaturedHeroTitle>
                            <FeaturedHeroSnippet>
                                {featured[0].intro.slice(0, 180)}…
                            </FeaturedHeroSnippet>
                            <FeaturedHeroCTA>Read Guide →</FeaturedHeroCTA>
                        </FeaturedHeroCard>

                        {featured.slice(1).map((post) => {
                            const cat = CATEGORY_MAP[post.slug];
                            const catStyle = CATEGORY_COLORS[cat] || {};
                            return (
                                <FeaturedSideCard
                                    key={post.slug}
                                    elevation={0}
                                    onClick={() => navigate(post.slug)}
                                >
                                    <CardMetaRow>
                                        <CardTag $color={catStyle.color} $bg={catStyle.bg}>
                                            {cat}
                                        </CardTag>
                                        <CardReadTime>~{getReadingTime(post)} min read</CardReadTime>
                                    </CardMetaRow>
                                    <FeaturedSideTitle>
                                        {post.title.split(" — ")[0]}
                                    </FeaturedSideTitle>
                                    <FeaturedSideSnippet>
                                        {post.intro.slice(0, 100)}…
                                    </FeaturedSideSnippet>
                                    <BlogIndexCardLink>Read Guide →</BlogIndexCardLink>
                                </FeaturedSideCard>
                            );
                        })}
                    </FeaturedGrid>
                </FeaturedSection>
            )}

            {/* ── Popular Guides ──────────────────────────────────── */}
            {!search && activeCategory === "All" && (
                <>
                    <SectionLabel>Popular Guides</SectionLabel>
                    <PopularList>
                        {popularPosts.map((post, i) => {
                            const cat = CATEGORY_MAP[post.slug];
                            const catStyle = CATEGORY_COLORS[cat] || {};
                            return (
                                <PopularRow
                                    key={post.slug}
                                    elevation={0}
                                    onClick={() => navigate(post.slug)}
                                >
                                    <PopularRank $n={i + 1}>#{i + 1}</PopularRank>
                                    <PopularRowContent>
                                        <PopularRowTitle>{post.title.split(" — ")[0]}</PopularRowTitle>
                                    </PopularRowContent>
                                    <CardMetaRow style={{ margin: 0 }}>
                                        <CardTag $color={catStyle.color} $bg={catStyle.bg}>{cat}</CardTag>
                                        <CardReadTime>~{getReadingTime(post)} min</CardReadTime>
                                    </CardMetaRow>
                                </PopularRow>
                            );
                        })}
                    </PopularList>
                </>
            )}

            {/* ── Category filter ─────────────────────────────────── */}
            {!search && (
                <CategoryBar>
                    {CATEGORIES.map((cat) => (
                        <CategoryChip
                            key={cat}
                            $active={activeCategory === cat}
                            onClick={() => setActiveCategory(cat)}
                        >
                            {cat}
                        </CategoryChip>
                    ))}
                </CategoryBar>
            )}

            {/* ── All Guides grid ─────────────────────────────────── */}
            <SectionLabel>
                {search
                    ? `Results for "${search}"`
                    : getSectionLabel(activeCategory)}
            </SectionLabel>

            {filtered.length > 0 ? (
                <BlogIndexGrid>
                    {filtered.map((post, i) => {
                        const cat = CATEGORY_MAP[post.slug];
                        const catStyle = CATEGORY_COLORS[cat] || {};
                        return (
                            <BlogIndexCard
                                key={post.slug}
                                elevation={0}
                                $delay={i * 40}
                                onClick={() => navigate(post.slug)}
                            >
                                <CardMetaRow>
                                    <CardTag $color={catStyle.color} $bg={catStyle.bg}>
                                        {cat}
                                    </CardTag>
                                    <CardReadTime>~{getReadingTime(post)} min read</CardReadTime>
                                </CardMetaRow>
                                <BlogIndexCardTitle>
                                    {post.title.split(" — ")[0]}
                                </BlogIndexCardTitle>
                                <BlogIndexCardSnippet>
                                    {post.intro.slice(0, 120)}…
                                </BlogIndexCardSnippet>
                                <BlogIndexCardLink>Read Guide →</BlogIndexCardLink>
                            </BlogIndexCard>
                        );
                    })}
                </BlogIndexGrid>
            ) : (
                <div style={{ padding: "32px 0", color: "var(--text-secondary)", fontSize: "0.875rem", opacity: 0.6 }}>
                    No guides found.
                </div>
            )}
        </BlogIndexWrapper>
    );
}
