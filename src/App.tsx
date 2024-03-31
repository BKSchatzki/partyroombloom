import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

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
      <SceneForm />
    </ThemeProvider>
  );
};

export default App;
