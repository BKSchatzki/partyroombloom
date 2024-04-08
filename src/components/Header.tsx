import { useState } from 'react';

import {
  FilterVintage,
  Menu,
} from '@mui/icons-material';
import {
  AppBar,
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Toolbar,
  Typography,
  useMediaQuery,
} from '@mui/material';

import { sceneInit } from '../data/sceneInit';
import type { Scene } from '../pages/SceneForm';
import { saveSceneToJson } from '../utils/saveScenetoJson';
import MenuDrawer from './MenuDrawer';

const Header = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const toggleDrawer = (newOpen: boolean) => () => {
    setDrawerOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      sx={{ top: 0 }}
    >
      <Toolbar
        variant="dense"
        sx={{ justifyContent: 'space-between', gap: 1 }}
      >
        <IconButton onClick={toggleDrawer(true)}>
          <Menu color={`action`} />
        </IconButton>
        <MenuDrawer
          scene={scene}
          setScene={setScene}
          drawerOpen={drawerOpen}
          toggleDrawer={toggleDrawer}
          setDialogOpen={setDialogOpen}
        />
        <Dialog
          open={dialogOpen}
          onClose={() => {
            setDialogOpen(false);
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{'Are you sure?'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              This will reset the entire scene. You will lose all info, landmark, hidden, and secret
              things. Consider backing up the scene by saving its data to your device.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonGroup
              fullWidth={true}
              size={`large`}
              variant={`text`}
              color={`inherit`}
              orientation={isMobile ? 'vertical' : 'horizontal'}
            >
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button
                color={`warning`}
                onClick={() => {
                  saveSceneToJson();
                  setScene(sceneInit);
                  setDialogOpen(false);
                }}
                autoFocus
              >
                Save and Reset
              </Button>
              <Button
                color={`error`}
                onClick={() => {
                  setScene(sceneInit);
                  setDialogOpen(false);
                }}
                autoFocus
              >
                Reset Scene
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'end',
            gap: 1,
          }}
        >
          <Typography
            variant={'h1'}
            fontSize={'1.5rem'}
            fontWeight={'bold'}
          >
            PartyRoomBloom
          </Typography>
          <FilterVintage />
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
