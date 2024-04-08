import React, { useState } from 'react';

import {
  Add,
  Clear,
} from '@mui/icons-material';
import { Masonry } from '@mui/lab';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Checkbox,
  Divider,
  FormControlLabel,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const HiddenThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const [deletedHiddenItem, setDeletedHiddenItem] = useState<
    Scene['landmarkThings'][number]['hiddenThings'][number] | null
  >(null);
  const [deletedHiddenItemLandmarkIndex, setDeletedHiddenItemLandmarkIndex] = useState<number>(0);
  const [deletedHiddenIndex, setDeletedHiddenIndex] = useState<number>(0);
  const [undoSnackbar, setUndoSnackbar] = useState({
    open: false,
  });

  const handleUndoDelete = () => {
    if (!deletedHiddenItem) return;
    const updatedLandmarkItems = [...scene.landmarkThings];
    updatedLandmarkItems[deletedHiddenItemLandmarkIndex].hiddenThings.splice(
      deletedHiddenIndex,
      0,
      deletedHiddenItem
    );
    setScene({ ...scene, landmarkThings: updatedLandmarkItems });
    setDeletedHiddenItem(null);
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
        <Clear fontSize="small" />
      </IconButton>
    </>
  );

  const newHiddenThing = {
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
  };

  return (
    <>
      <Typography
        variant={`h2`}
        fontSize={`1.8rem`}
        fontWeight={`bold`}
        sx={{ pt: 2 }}
      >
        Hidden Things
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
            <CardHeader
              title={
                landmarkItem.landmarkName
                  ? `📍 ${landmarkItem.landmarkName}`
                  : `📍 Landmark Thing ${landmarkIndex + 1}`
              }
              titleTypographyProps={{
                sx: { fontSize: '1.2rem' },
              }}
            />
            <Divider />
            {landmarkItem.hiddenThings.map((hiddenItem, hiddenIndex) => (
              <CardContent key={hiddenIndex}>
                <Stack spacing={2}>
                  <TextField
                    label={`🔎 Hidden Thing ${hiddenIndex + 1}`}
                    value={hiddenItem.hiddenName}
                    onChange={(e) => {
                      const updatedLandmarkItems = [...scene.landmarkThings];
                      updatedLandmarkItems[landmarkIndex].hiddenThings[hiddenIndex].hiddenName =
                        e.target.value;
                      setScene({
                        ...scene,
                        landmarkThings: updatedLandmarkItems,
                      });
                    }}
                    fullWidth={true}
                    variant={'outlined'}
                  />
                  <TextField
                    label={'Description'}
                    value={hiddenItem.hiddenDescription}
                    onChange={(e) => {
                      const updatedLandmarkItems = [...scene.landmarkThings];
                      updatedLandmarkItems[landmarkIndex].hiddenThings[
                        hiddenIndex
                      ].hiddenDescription = e.target.value;
                      setScene({
                        ...scene,
                        landmarkThings: updatedLandmarkItems,
                      });
                    }}
                    fullWidth={true}
                    variant={'outlined'}
                    multiline
                    minRows={2}
                    maxRows={Infinity}
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        color={'warning'}
                        checked={hiddenItem.hasSecret}
                        onChange={(e) => {
                          const updatedLandmarkItems = [...scene.landmarkThings];
                          updatedLandmarkItems[landmarkIndex].hiddenThings[hiddenIndex].hasSecret =
                            e.target.checked;
                          setScene({
                            ...scene,
                            landmarkThings: updatedLandmarkItems,
                          });
                        }}
                      />
                    }
                    label={'🎲 Can roll for secrets'}
                  />
                  <ButtonGroup
                    size={'small'}
                    color={'inherit'}
                    variant={'outlined'}
                    fullWidth={true}
                  >
                    <Button
                      color={'error'}
                      disabled={landmarkItem.hiddenThings.length === 1}
                      onClick={() => {
                        setDeletedHiddenItem(landmarkItem.hiddenThings[hiddenIndex]);
                        setDeletedHiddenItemLandmarkIndex(landmarkIndex);
                        setDeletedHiddenIndex(hiddenIndex);
                        setUndoSnackbar({ open: true });
                        const updatedLandmarkItems = [...scene.landmarkThings];
                        updatedLandmarkItems[landmarkIndex].hiddenThings = updatedLandmarkItems[
                          landmarkIndex
                        ].hiddenThings.filter((_, i) => i !== hiddenIndex);
                        setScene({ ...scene, landmarkThings: updatedLandmarkItems });
                      }}
                    >
                      <Clear />
                    </Button>
                    <Button
                      color={'primary'}
                      sx={{ width: '500%' }}
                      onClick={() => {
                        const updatedLandmarkItems = [...scene.landmarkThings];
                        updatedLandmarkItems[landmarkIndex].hiddenThings.splice(
                          hiddenIndex + 1,
                          0,
                          newHiddenThing
                        );
                        setScene({
                          ...scene,
                          landmarkThings: updatedLandmarkItems,
                        });
                      }}
                    >
                      <Add />
                    </Button>
                  </ButtonGroup>
                </Stack>{' '}
              </CardContent>
            ))}
          </Card>
        ))}
        {deletedHiddenItem && (
          <Snackbar
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            open={undoSnackbar.open}
            message="Hidden thing deleted"
            action={snackbarActions}
          />
        )}
      </Masonry>
    </>
  );
};

export default HiddenThingCards;
