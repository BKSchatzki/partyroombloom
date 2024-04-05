import {
  ArrowBackIosNew,
  ArrowForwardIos,
} from '@mui/icons-material';
import {
  AppBar,
  Button,
  Toolbar,
} from '@mui/material';

const FormNav = ({
  formStep,
  setFormStep,
}: {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
}) => {
  const breadcrumbs = ['Info', 'Landmark', 'Hidden', 'Secret', 'Review'];

  return (
    <AppBar
      position={`fixed`}
      sx={{ top: 'auto', bottom: 0 }}
    >
      <Toolbar
        variant={`dense`}
        sx={{ justifyContent: 'space-between' }}
      >
        <Button
          onClick={() => setFormStep((prev) => prev - 1)}
          disabled={formStep === 0}
          variant={`text`}
          size={`small`}
        >
          <ArrowBackIosNew />
          {breadcrumbs[formStep - 1]}
        </Button>
        <Button
          onClick={() => setFormStep((prev) => prev + 1)}
          disabled={formStep === 4}
          variant={`text`}
          size={`small`}
        >
          {breadcrumbs[formStep + 1]}
          <ArrowForwardIos />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default FormNav;
