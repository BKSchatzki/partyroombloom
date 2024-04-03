import { ArrowBackIosNew, ArrowForwardIos } from '@mui/icons-material';
import { AppBar, Button, Toolbar } from '@mui/material';

const FormNav = ({
  formStep,
  setFormStep,
  generatePdf,
}: {
  formStep: number;
  setFormStep: React.Dispatch<React.SetStateAction<number>>;
  generatePdf: () => void;
}) => {
  return (
    <AppBar
      position={'fixed'}
      sx={{ top: 'auto', bottom: 0 }}
    >
      <Toolbar
        variant="dense"
        sx={{ justifyContent: 'space-between' }}
      >
        <Button
          onClick={() => setFormStep((prev) => prev - 1)}
          disabled={formStep === 0}
          variant={'text'}
        >
          <ArrowBackIosNew />
        </Button>
        {formStep === 3 && (
          <Button
            variant="contained"
            onClick={generatePdf}
          >
            Download PDF
          </Button>
        )}
        <Button
          onClick={() => setFormStep((prev) => prev + 1)}
          disabled={formStep === 3}
          variant={'text'}
        >
          <ArrowForwardIos />
        </Button>
      </Toolbar>
    </AppBar>
  );
};

export default FormNav;
