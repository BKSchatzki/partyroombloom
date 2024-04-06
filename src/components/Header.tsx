// import { useState } from 'react';

import { FilterVintage } from '@mui/icons-material';
// import { Menu } from '@mui/icons-material';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';

// import { Button } from '@mui/material';

// import MenuDrawer from './MenuDrawer';

const Header = () => {
  // const [open, setOpen] = useState(false);

  // const toggleDrawer = (newOpen: boolean) => () => {
  //   setOpen(newOpen);
  // };

  return (
    <AppBar
      position="fixed"
      sx={{ top: 0 }}
    >
      <Toolbar
        variant="dense"
        sx={{ justifyContent: 'space-between', gap: 1 }}
      >
        <Box
          sx={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'start',
            gap: 1,
          }}
        >
          <FilterVintage />
          <Typography
            variant={'h1'}
            fontSize={'1.5rem'}
            fontWeight={'bold'}
          >
            PartyRoomBloom
          </Typography>
        </Box>
        {/* <Button onClick={toggleDrawer(true)}>
          <Menu color={`action`} />
        </Button>
        <MenuDrawer
          open={open}
          toggleDrawer={toggleDrawer}
        /> */}
      </Toolbar>
    </AppBar>
  );
};

export default Header;
