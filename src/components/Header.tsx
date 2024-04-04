import React from 'react';

import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
} from '@clerk/clerk-react';
import { FilterVintage } from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  Toolbar,
  Typography,
} from '@mui/material';

const Header = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ top: 0 }}
    >
      <Toolbar
        variant="dense"
        sx={{ justifyContent: 'space-between', gap: 1 }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FilterVintage />
          <Typography
            variant={'h1'}
            fontSize={'1.5rem'}
            fontWeight={'bold'}
          >
            PartyRoomBloom
          </Typography>
        </Box>
        <header>
          <SignedOut>
            <SignInButton mode={'modal'}>
              <Button
                variant={'contained'}
                size={'small'}
              >
                Sign In
              </Button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>
        </header>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
