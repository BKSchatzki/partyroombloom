import { FilterVintage } from '@mui/icons-material';
import {
  AppBar,
  Box,
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
      </Toolbar>
    </AppBar>
  );
};

export default Header;
