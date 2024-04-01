import { FilterVintage } from '@mui/icons-material';
import { AppBar, Box, CssBaseline, Toolbar, Typography } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';

import SceneForm from './pages/SceneForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
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
      <SceneForm />
    </ThemeProvider>
  );
};

export default App;
