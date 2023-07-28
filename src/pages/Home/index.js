import { Paper, Typography } from '@mui/material';
import NoData from 'components/Shared/NoData';
import localization from 'localization';
import { cloneDeep, filter, includes, isEmpty, map, toLower } from 'lodash';
import { string } from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { GLOBAL_CONSTANTS } from 'utils/globalConstants';
import { StyledCard, StyledContainer, StyledGridContainer, StyledGridItem, StyledLink } from './styles';

function Home({ searchQuery }) {
  const { OPERATIONS_ITEMS } = GLOBAL_CONSTANTS;
  const { noSearchDataMessage } = localization;

  let gridItems = cloneDeep(OPERATIONS_ITEMS);
  if (searchQuery) {
    gridItems = filter(OPERATIONS_ITEMS, (item) => includes(toLower(item.label), toLower(searchQuery)));
  }

  return (
    <StyledContainer search={searchQuery} dataLength={OPERATIONS_ITEMS.length}>
      <StyledGridContainer container sx={{ flexGrow: 1 }}>
        <StyledGridItem item xs={12}>
          <StyledGridContainer container spacing={2} justifyContent="flex-start">
            {!isEmpty(gridItems)
              ? map(gridItems, (item) => (
                  <StyledGridItem item>
                    <Paper sx={{ width: { xs: 210, sm: 230, md: 260, lg: 340, xl: 300 }, height: { xs: 210, sm: 230, md: 260, lg: 340, xl: 300 } }}>
                      <StyledLink to={item.route}>
                        <StyledCard>
                          {item.icon}
                          <Typography sx={{ textAlign: 'center', fontWeight: 500 }}>{item.label}</Typography>
                        </StyledCard>
                      </StyledLink>
                    </Paper>
                  </StyledGridItem>
                ))
              : null}
          </StyledGridContainer>
        </StyledGridItem>
      </StyledGridContainer>
      {searchQuery && isEmpty(gridItems) ? <NoData title={noSearchDataMessage.replace('[DATA]', searchQuery)} /> : null}
    </StyledContainer>
  );
}

Home.defaultProps = {
  searchQuery: '',
};

Home.propTypes = {
  searchQuery: string,
};

const mapStateToProps = (state) => {
  const { searchQuery } = state.headerReducer || {};
  return {
    searchQuery,
  };
};

export default connect(mapStateToProps)(Home);
