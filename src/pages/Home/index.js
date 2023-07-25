import { Box, Typography } from '@mui/material';
import { assign, cloneDeep, filter, forEach, has, includes, isEmpty, toLower } from 'lodash';
import React, { useEffect, useState } from 'react';
import { GLOBAL_CONSTANTS } from 'utils/globalConstants';
import { connect } from 'react-redux';
import { string } from 'prop-types';
import NoData from 'components/Shared/NoData';
import ResponsiveGridLayout from 'components/ResponsiveGridLayout';
import { StyledCard, StyledContainer, StyledLink } from './styles';

function Home({ searchQuery }) {
  const [gridLayouts, setGridLayouts] = useState({});
  const [gridChildren, setGridChildren] = useState([]);

  const { OPERATIONS_ITEMS, DEFAULT_GRID_LAYOUT_CONFIG } = GLOBAL_CONSTANTS;

  useEffect(() => {
    const newGridLayout = {};
    const newGridChildren = [];
    let gridItems = cloneDeep(OPERATIONS_ITEMS);
    if (searchQuery) {
      gridItems = filter(OPERATIONS_ITEMS, (item) => includes(toLower(item.label), toLower(searchQuery)));
    }
    if (!isEmpty(gridItems)) {
      forEach(gridItems, (item, index) => {
        const layoutConfig = cloneDeep(DEFAULT_GRID_LAYOUT_CONFIG);
        layoutConfig.i = item.route;
        layoutConfig.x = index % 6 === 0 ? 0 : index * layoutConfig.w;
        layoutConfig.y = index % 6 === 0 ? Infinity : 0;
        if (has(newGridLayout, 'lg')) {
          newGridLayout.lg.push(layoutConfig);
        } else {
          assign(newGridLayout, { lg: [layoutConfig] });
        }
        newGridChildren.push(
          <div key={item.route}>
            <Box sx={{ width: '100%', height: '100%', boxShadow: '-12px 11px 83px -10px rgba(227,218,227,1)' }}>
              <StyledLink to={item.route}>
                <StyledCard>
                  {item.icon}
                  <Typography sx={{ textAlign: 'center' }}>{item.label}</Typography>
                </StyledCard>
              </StyledLink>
            </Box>
          </div>,
        );
      });
    }
    setGridLayouts(newGridLayout);
    setGridChildren(newGridChildren);
  }, [DEFAULT_GRID_LAYOUT_CONFIG, OPERATIONS_ITEMS, searchQuery]);

  return (
    <StyledContainer search={searchQuery} dataLength={OPERATIONS_ITEMS.length}>
      {!isEmpty(gridChildren) ? (
        <ResponsiveGridLayout gridLayouts={gridLayouts}>{gridChildren}</ResponsiveGridLayout>
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