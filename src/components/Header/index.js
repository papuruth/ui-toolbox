import { Clear } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import gearIcon from 'assets/images/gear.svg';
import { StyledImageRenderer } from 'components/Shared/Styled-Components';
import localization from 'localization';
import { func } from 'prop-types';
import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import colors from 'styles/colors';
import { handleSearchAction } from './HeaderAction';
import { ClearIconWrapper, Search, SearchIconWrapper, StyledContainer, StyledInputBase } from './styles';

function Header({ dispatch }) {
  const [searchText, setSearchText] = useState('');
  const handleInputChange = (event) => {
    setSearchText(event.target.value);
    dispatch(handleSearchAction(event.target.value));
  };

  const handleSearchClear = () => {
    setSearchText('');
    dispatch(handleSearchAction(''));
  };

  return (
    <StyledContainer sx={{ flexGrow: 1 }}>
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', lineHeight: 1 }}>
            <Link to="/" style={{ color: colors.white }}>
              <StyledImageRenderer src={gearIcon} alt="web-logo" />
            </Link>
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ ml: 2 }} />
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'flex' }, alignItems: 'center', ml: 2 }}>
            <Link to="/" style={{ color: colors.white }}>
              {localization.appTitle}
            </Link>
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={handleInputChange} value={searchText} />
            {searchText ? (
              <ClearIconWrapper>
                <IconButton onClick={handleSearchClear}>
                  <Clear htmlColor={colors.white} />
                </IconButton>
              </ClearIconWrapper>
            ) : null}
          </Search>
        </Toolbar>
      </AppBar>
    </StyledContainer>
  );
}

Header.propTypes = {
  dispatch: func.isRequired,
};

export default connect()(Header);
