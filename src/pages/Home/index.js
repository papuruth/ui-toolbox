import NoData from "components/Shared/NoData";
import localization from "localization";
import { cloneDeep, filter, includes, isEmpty, map, toLower } from "lodash";
import { string } from "prop-types";
import React from "react";
import { connect } from "react-redux";
import { GLOBAL_CONSTANTS } from "utils/globalConstants";
import { StyledCard, StyledContainer, StyledGridContainer, StyledGridItem, StyledLink, StyledText } from "./styles";

function Home({ searchQuery }) {
    const { OPERATIONS_ITEMS } = GLOBAL_CONSTANTS;
    const { noSearchDataMessage } = localization;

    let gridItems = cloneDeep(OPERATIONS_ITEMS);
    if (searchQuery) {
        gridItems = filter(OPERATIONS_ITEMS, (item) => includes(toLower(item.label), toLower(searchQuery)));
    }

    return (
        <StyledContainer search={searchQuery} dataLength={OPERATIONS_ITEMS.length}>
            <StyledGridContainer>
                {!isEmpty(gridItems)
                    ? map(gridItems, (item) => (
                          <StyledGridItem key={item.route.slice(1)}>
                              <StyledLink to={item.route}>
                                  <StyledCard>
                                      {item.icon}
                                      <StyledText variant="h5" sx={{ textAlign: "center", fontWeight: 500 }}>
                                          {item.label}
                                      </StyledText>
                                  </StyledCard>
                              </StyledLink>
                          </StyledGridItem>
                      ))
                    : null}
            </StyledGridContainer>
            {searchQuery && isEmpty(gridItems) ? <NoData title={noSearchDataMessage.replace("[DATA]", searchQuery)} /> : null}
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
