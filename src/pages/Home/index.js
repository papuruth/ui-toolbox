import NoData from "components/Shared/NoData";
import localization from "localization";
import { filter, includes, isEmpty, map, toLower } from "lodash";
import PropTypes, { string } from "prop-types";
import React, { useMemo } from "react";
import { connect } from "react-redux";
import { GLOBAL_CONSTANTS, TOOL_CATEGORIES } from "utils/globalConstants";
import storage from "utils/storage";
import {
    StyledBadge,
    StyledCard,
    StyledCardContent,
    StyledCardDescription,
    StyledCardIconWrapper,
    StyledCardTitle,
    StyledContainer,
    StyledGridContainer,
    StyledGridItem,
    StyledHero,
    StyledHeroBadge,
    StyledHeroSubtitle,
    StyledHeroTitle,
    StyledLink,
    StyledSectionAccent,
    StyledSectionHeader,
    StyledSectionTitle,
    StyledSectionWrapper
} from "./styles";

function ToolCard({ item }) {
    const category = TOOL_CATEGORIES.find((c) => c.id === item.category);
    const accentColor = category?.color || "#22cc99";

    return (
        <StyledGridItem $accentColor={accentColor}>
            <StyledLink to={item.route}>
                <StyledCard>
                    <StyledCardIconWrapper $accentColor={accentColor}>{item.icon}</StyledCardIconWrapper>
                    <StyledCardContent>
                        <StyledCardTitle variant="body1">{item.label}</StyledCardTitle>
                        {item.description ? <StyledCardDescription variant="caption">{item.description}</StyledCardDescription> : null}
                    </StyledCardContent>
                </StyledCard>
                {item.badge ? <StyledBadge label={item.badge} size="small" color={item.badge === "popular" ? "primary" : "secondary"} /> : null}
            </StyledLink>
        </StyledGridItem>
    );
}

ToolCard.propTypes = {
    item: PropTypes.shape({
        category: string,
        route: string,
        icon: PropTypes.node,
        label: string,
        description: string,
        badge: string
    }).isRequired
};

function Home({ searchQuery }) {
    const { OPERATIONS_ITEMS } = GLOBAL_CONSTANTS;
    const { noSearchDataMessage } = localization;
    const totalTools = OPERATIONS_ITEMS.length;

    const recentRoutes = storage.getRecentTools();
    const recentItems = useMemo(
        () => recentRoutes.map((route) => OPERATIONS_ITEMS.find((item) => item.route === route)).filter(Boolean),
        [recentRoutes, OPERATIONS_ITEMS]
    );

    if (searchQuery) {
        const filtered = filter(OPERATIONS_ITEMS, (item) => includes(toLower(item.label), toLower(searchQuery)));
        return (
            <StyledContainer>
                <StyledSectionWrapper>
                    <StyledSectionHeader>
                        <StyledSectionAccent $color="#22cc99" />
                        <StyledSectionTitle variant="h6">Search results for &ldquo;{searchQuery}&rdquo;</StyledSectionTitle>
                    </StyledSectionHeader>
                    {!isEmpty(filtered) ? (
                        <StyledGridContainer>
                            {map(filtered, (item) => (
                                <ToolCard key={item.route} item={item} />
                            ))}
                        </StyledGridContainer>
                    ) : (
                        <NoData title={noSearchDataMessage.replace("[DATA]", searchQuery)} />
                    )}
                </StyledSectionWrapper>
            </StyledContainer>
        );
    }

    return (
        <StyledContainer>
            <StyledHero>
                <StyledHeroTitle variant="h3">UI Toolbox</StyledHeroTitle>
                <StyledHeroSubtitle variant="h6">A collection of handy tools to boost your productivity</StyledHeroSubtitle>
                <StyledHeroBadge label={`${totalTools} tools available`} variant="outlined" size="small" />
            </StyledHero>

            <StyledSectionWrapper>
                {recentItems.length > 0 ? (
                    <>
                        <StyledSectionHeader>
                            <StyledSectionAccent $color="#ff9800" />
                            <StyledSectionTitle variant="h6">Recently Used</StyledSectionTitle>
                        </StyledSectionHeader>
                        <StyledGridContainer>
                            {map(recentItems, (item) => (
                                <ToolCard key={`recent-${item.route}`} item={item} />
                            ))}
                        </StyledGridContainer>
                    </>
                ) : null}

                {map(TOOL_CATEGORIES, (category) => {
                    const categoryItems = filter(OPERATIONS_ITEMS, (item) => item.category === category.id);
                    if (isEmpty(categoryItems)) return null;
                    return (
                        <div key={category.id}>
                            <StyledSectionHeader>
                                <StyledSectionAccent $color={category.color} />
                                <StyledSectionTitle variant="h6">{category.label}</StyledSectionTitle>
                            </StyledSectionHeader>
                            <StyledGridContainer>
                                {map(categoryItems, (item) => (
                                    <ToolCard key={item.route} item={item} />
                                ))}
                            </StyledGridContainer>
                        </div>
                    );
                })}
            </StyledSectionWrapper>
        </StyledContainer>
    );
}

Home.defaultProps = {
    searchQuery: ""
};

Home.propTypes = {
    searchQuery: string
};

const mapStateToProps = (state) => {
    const { searchQuery } = state.headerReducer || {};
    return {
        searchQuery
    };
};

export default connect(mapStateToProps)(Home);
