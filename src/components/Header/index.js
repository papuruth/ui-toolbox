import { Clear } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Divider, IconButton } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import localization from 'localization';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import colors from 'styles/colors';
import { connect } from 'react-redux';
import { func } from 'prop-types';
import { ClearIconWrapper, Search, SearchIconWrapper, StyledContainer, StyledInputBase } from './styles';
import { handleSearchAction } from './HeaderAction';

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
          <Typography variant="h6" noWrap component="div" sx={{ display: { xs: 'none', sm: 'block' } }}>
            <Link to="/">{localization.appTitle}</Link>
          </Typography>
          <Divider orientation="vertical" flexItem sx={{ ml: 1 }} />
          <Box sx={{ flexGrow: 1 }} />
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase placeholder="Search…" inputProps={{ 'aria-label': 'search' }} onChange={handleInputChange} value={searchText} />
            <ClearIconWrapper>
              <IconButton onClick={handleSearchClear}>
                <Clear htmlColor={colors.white} />
              </IconButton>
            </ClearIconWrapper>
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
