import React from "react";
import { Helmet } from "react-helmet-async";
import { string } from "prop-types";
import { SEO_META, BASE_URL } from "utils/seoMeta";

function buildJsonLd(route, meta) {
    const url = `${BASE_URL}${route}`;

    if (route === "/") {
        return {
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: "DevDeck",
            url: BASE_URL,
            description: meta.description,
            potentialAction: {
                "@type": "SearchAction",
                target: {
                    "@type": "EntryPoint",
                    urlTemplate: `${BASE_URL}/?q={search_term_string}`
                },
                "query-input": "required name=search_term_string"
            }
        };
    }

    return {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: meta.title.split(" — ")[0],
        url,
        description: meta.description,
        applicationCategory: "DeveloperApplication",
        operatingSystem: "Web",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD"
        }
    };
}

export default function ToolSEO({ route }) {
    const meta = SEO_META[route] || SEO_META["/"];
    const canonicalUrl = `${BASE_URL}${route}`;
    const jsonLd = buildJsonLd(route, meta);

    return (
        <Helmet>
            <title>{meta.title}</title>
            <meta name="description" content={meta.description} />
            <link rel="canonical" href={canonicalUrl} />
            <meta name="keywords" content={meta.keywords} />

            {/* Open Graph */}
            <meta property="og:type" content="website" />
            <meta property="og:site_name" content="DevDeck" />
            <meta property="og:title" content={meta.title} />
            <meta property="og:description" content={meta.description} />
            <meta property="og:url" content={canonicalUrl} />
            <meta property="og:image" content={`${BASE_URL}/assets/images/og-preview.png`} />

            {/* Twitter Card */}
            <meta name="twitter:card" content="summary_large_image" />
            <meta name="twitter:title" content={meta.title} />
            <meta name="twitter:description" content={meta.description} />
            <meta name="twitter:image" content={`${BASE_URL}/assets/images/og-preview.png`} />

            {/* JSON-LD */}
            <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
        </Helmet>
    );
}

ToolSEO.propTypes = {
    route: string.isRequired
};
