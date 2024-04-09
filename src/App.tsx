import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';
import { Analytics } from '@vercel/analytics/react';

import SceneForm from './pages/SceneForm';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <Analytics />
      <CssBaseline />
      <SceneForm />
    </ThemeProvider>
  );
};

export default App;
