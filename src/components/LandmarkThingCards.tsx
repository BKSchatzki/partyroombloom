import React, { useState } from 'react';

import {
  Add,
  Clear,
  Close,
} from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const LandmarkThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const [deletedLandmarkItem, setDeletedLandmarkItem] = useState<
    Scene['landmarkThings'][number] | null
  >(null);
  const [deletedLandmark, setDeletedLandmarkIndex] = useState<number>(0);
  const [undoSnackbar, setUndoSnackbar] = useState({
    open: false,
  });

  const handleUndoDelete = () => {
    if (!deletedLandmarkItem) return;
    const updatedItems = [...scene.landmarkThings];
    updatedItems.splice(deletedLandmark, 0, deletedLandmarkItem);
    setScene({ ...scene, landmarkThings: updatedItems });
    setDeletedLandmarkItem(null);
  };

  const snackbarActions = (
    <>
      <Button
        color={`secondary`}
        size={`small`}
        onClick={() => handleUndoDelete()}
      >
        Undo?
      </Button>
      <IconButton
        size={`small`}
        aria-label={`close`}
        color={`inherit`}
        onClick={() => setUndoSnackbar({ open: false })}
      >
        <Close fontSize="small" />
      </IconButton>
    </>
  );

  const newLandmarkThing = {
    landmarkName: '',
    landmarkDescription: '',
    hiddenThings: [
      {
        hiddenName: '',
        hiddenDescription: '',
        hasSecret: false,
        secretThings: [
          {
            secretName: '',
            secretDescription: '',
            onSuccess: '',
            onFailure: '',
          },
        ],
      },
    ],
  };

  return (
    <>
      <Typography
        variant={`h2`}
        fontSize={`1.8rem`}
        fontWeight={`bold`}
        sx={{ pt: 2 }}
      >
        Landmark Things
      </Typography>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        sequential
      >
        {scene.landmarkThings.map((landmarkItem, landmarkIndex) => (
          <Card
            key={landmarkIndex}
            sx={{ mx: 1, my: 1 }}
            elevation={1}
          >
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label={`📍 Landmark Thing ${landmarkIndex + 1}`}
                  value={landmarkItem.landmarkName}
                  onChange={(e) => {
                    const updatedItems = [...scene.landmarkThings];
                    updatedItems[landmarkIndex].landmarkName = e.target.value;
                    setScene({
                      ...scene,
                      landmarkThings: updatedItems,
                    });
                  }}
                  fullWidth={true}
                  variant={'outlined'}
                />
                <TextField
                  label={'Description'}
                  value={landmarkItem.landmarkDescription}
                  onChange={(e) => {
                    const updatedItems = [...scene.landmarkThings];
                    updatedItems[landmarkIndex].landmarkDescription = e.target.value;
                    setScene({
                      ...scene,
                      landmarkThings: updatedItems,
                    });
                  }}
                  fullWidth={true}
                  variant={'outlined'}
                  multiline
                  minRows={2}
                  maxRows={Infinity}
                />
                <ButtonGroup
                  size={'small'}
                  color={'inherit'}
                  variant={'outlined'}
                  fullWidth={true}
                >
                  <Button
                    color={'error'}
                    disabled={scene.landmarkThings.length === 1}
                    onClick={() => {
                      setDeletedLandmarkItem(scene.landmarkThings[landmarkIndex]);
                      setDeletedLandmarkIndex(landmarkIndex);
                      setUndoSnackbar({ open: true });
                      const updatedItems = [
                        ...scene.landmarkThings.filter((_, i) => i !== landmarkIndex),
                      ];
                      setScene({
                        ...scene,
                        landmarkThings: updatedItems,
                      });
                    }}
                  >
                    <Clear />
                  </Button>
                  <Button
                    color={'primary'}
                    sx={{ width: '500%' }}
                    onClick={() => {
                      const updatedItems = [...scene.landmarkThings];
                      const itemIndex = landmarkIndex;
                      updatedItems.splice(itemIndex + 1, 0, newLandmarkThing);
                      setScene({
                        ...scene,
                        landmarkThings: updatedItems,
                      });
                    }}
                  >
                    <Add />
                  </Button>
                </ButtonGroup>
              </Stack>{' '}
            </CardContent>
          </Card>
        ))}
        {deletedLandmarkItem && (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={undoSnackbar.open}
            message="Landmark thing deleted"
            action={snackbarActions}
          />
        )}
      </Masonry>
    </>
  );
};

export default LandmarkThingCards;
