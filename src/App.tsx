import { CssBaseline } from '@mui/material';
import {
  createTheme,
  ThemeProvider,
} from '@mui/material/styles';

import Header from './components/Header';
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
      <Header />
      <SceneForm />
    </ThemeProvider>
  );
};

export default App;
