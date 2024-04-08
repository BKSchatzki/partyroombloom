import { Close } from '@mui/icons-material';
import {
  Box,
  Button,
  Drawer,
  IconButton,
  Stack,
  styled,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';
import { generateScenePdf } from '../utils/generateScenePdf';
import { saveSceneToJson } from '../utils/saveScenetoJson';

const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

const MenuDrawer = ({
  scene,
  setScene,
  drawerOpen,
  toggleDrawer,
  setDialogOpen,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  drawerOpen: boolean;
  toggleDrawer: (newOpen: boolean) => () => void;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleSceneUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files?.length) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e?.target?.result as string);
        setScene(data);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(files[0]);
    event.target.value = '';
  };

  return (
    <Drawer
      anchor={'left'}
      open={drawerOpen}
      onClose={toggleDrawer(false)}
    >
      <Box
        sx={{ width: 240 }}
        role="presentation"
      >
        <Stack
          spacing={3}
          px={2}
          py={0.5}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'start' }}
        >
          <IconButton onClick={toggleDrawer(false)}>
            <Close color={`action`} />
          </IconButton>
          <Button
            fullWidth={true}
            size={`large`}
            variant={`contained`}
            color={`primary`}
            component={`label`}
            role={undefined}
            tabIndex={-1}
          >
            Upload Scene
            <VisuallyHiddenInput
              type="file"
              accept=".json"
              onChange={(event) => {
                handleSceneUpload(event);
                toggleDrawer(false)();
              }}
            />
          </Button>
          <Button
            fullWidth={true}
            size={`large`}
            variant={`contained`}
            color={`warning`}
            onClick={() => {
              saveSceneToJson();
              toggleDrawer(false)();
            }}
          >
            Save Scene
          </Button>
          <Button
            fullWidth={true}
            size={`large`}
            variant={`contained`}
            color={`success`}
            onClick={() => {
              generateScenePdf(scene);
              toggleDrawer(false)();
            }}
          >
            Download PDF
          </Button>
          <Button
            fullWidth={true}
            size={`large`}
            variant={`contained`}
            color={`error`}
            onClick={() => {
              setDialogOpen(true);
              toggleDrawer(false)();
            }}
          >
            Reset Scene
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
};

export default MenuDrawer;
