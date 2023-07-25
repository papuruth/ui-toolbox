import { Box, Typography } from '@mui/material';
import { filter, includes, isEmpty, map, toLower } from 'lodash';
import React from 'react';
import { GLOBAL_CONSTANTS } from 'utils/globalConstants';
import { connect } from 'react-redux';
import { string } from 'prop-types';
import NoData from 'components/Shared/NoData';
import { StyledCard, StyledContainer, StyledLink } from './styles';

function Home({ searchQuery }) {
  let { OPERATIONS_ITEMS } = GLOBAL_CONSTANTS;

  if (searchQuery) {
    OPERATIONS_ITEMS = filter(OPERATIONS_ITEMS, (item) => includes(toLower(item.label), toLower(searchQuery)));
  }

  return (
    <StyledContainer search={searchQuery} dataLength={OPERATIONS_ITEMS.length}>
      {!isEmpty(OPERATIONS_ITEMS) ? (
        map(OPERATIONS_ITEMS, (item) => (
          <Box sx={{ width: 150, height: 150, m: '0 30px', boxShadow: '-12px 11px 83px -10px rgba(227,218,227,1)' }} key={item.route}>
            <StyledLink to={item.route}>
              <StyledCard>
                {item.icon}
                <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
              </StyledCard>
            </StyledLink>
          </Box>
        ))
      ) : (
        <NoData title={`No matching data found for ${searchQuery}`} />
      )}
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
