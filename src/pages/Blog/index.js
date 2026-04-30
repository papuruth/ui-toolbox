import React from "react";
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
    BlogIndexCardLink
} from "./styles";

export default function BlogIndex() {
    const dispatch = useDispatch();

    return (
        <BlogIndexWrapper>
            <ToolSEO route="/blog" />

            <BlogIndexHero>
                <BlogIndexTitle>DevDeck Blog</BlogIndexTitle>
                <BlogIndexSubtitle>Guides and deep-dives for every developer tool</BlogIndexSubtitle>
            </BlogIndexHero>

            <BlogIndexGrid>
                {blogList.map((post) => (
                    <BlogIndexCard key={post.slug} elevation={0} onClick={() => dispatch(push(`/blog/${post.slug}`))}>
                        <BlogIndexCardTitle>{post.title.split(" — ")[0]}</BlogIndexCardTitle>
                        <BlogIndexCardSnippet>{post.intro.slice(0, 120)}…</BlogIndexCardSnippet>
                        <BlogIndexCardLink>Read guide →</BlogIndexCardLink>
                    </BlogIndexCard>
                ))}
            </BlogIndexGrid>
        </BlogIndexWrapper>
    );
}
