import React, { useState } from 'react';

import { produce } from 'immer';

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
  Divider,
  IconButton,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const SecretThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const [deletedSecretItem, setDeletedSecretItem] = useState<
    Scene['landmarkThings'][number]['hiddenThings'][number]['secretThings'][number] | null
  >(null);
  const [deletedSecretItemLandmarkIndex, setDeletedSecretItemLandmarkIndex] = useState<number>(0);
  const [deletedSecretItemHiddenIndex, setDeletedSecretItemHiddenIndex] = useState<number>(0);
  const [deletedSecretItemSecretIndex, setDeletedSecretItemSecretIndex] = useState<number>(0);
  const [undoSnackbar, setUndoSnackbar] = useState({
    open: false,
  });

  const handleUndoDelete = () => {
    if (!deletedSecretItem) return;
    setScene((prevScene) => {
      return produce(prevScene, (draft) => {
        draft.landmarkThings[deletedSecretItemLandmarkIndex].hiddenThings[deletedSecretItemHiddenIndex].secretThings.splice(
          deletedSecretItemSecretIndex,
          0,
          deletedSecretItem
        );
      })
    })
    // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
    // const updatedLandmarkItems = [...scene.landmarkThings];
    // const updatedHiddenThings = [
    //   ...updatedLandmarkItems[deletedSecretItemLandmarkIndex].hiddenThings,
    // ];
    // updatedHiddenThings[deletedSecretItemHiddenIndex].secretThings.splice(
    //   deletedSecretItemSecretIndex,
    //   0,
    //   deletedSecretItem
    // );
    // updatedLandmarkItems[deletedSecretItemLandmarkIndex].hiddenThings = updatedHiddenThings;
    // setScene({ ...scene, landmarkThings: updatedLandmarkItems });
    setDeletedSecretItem(null);
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

  const newSecretThing = {
    secretName: '',
    secretDescription: '',
    onSuccess: '',
    onFailure: '',
  };

  return (
    <>
      <Typography
        variant={`h2`}
        fontSize={`1.8rem`}
        fontWeight={`bold`}
        sx={{ pt: 2 }}
      >
        Secret Things
      </Typography>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        sequential
      >
        {scene.landmarkThings.map((landmarkItem, landmarkIndex) => (
          <React.Fragment key={landmarkIndex}>
            {landmarkItem.hiddenThings.map((hiddenItem, hiddenIndex) => (
              <React.Fragment key={hiddenIndex}>
                {hiddenItem.hasSecret && (
                  <Card sx={{ mx: 1, my: 1 }}>
                    <CardHeader
                      title={
                        hiddenItem.hiddenName
                          ? `🔎 ${hiddenItem.hiddenName}`
                          : `🔎 Hidden Thing ${hiddenIndex + 1}`
                      }
                      titleTypographyProps={{
                        sx: { fontSize: '1.2rem' },
                      }}
                    />
                    <Divider />
                    {hiddenItem.secretThings.map((secretItem, secretIndex) => (
                      <CardContent key={secretIndex}>
                        <Stack spacing={2}>
                          <TextField
                            label={`🔒 Secret Thing ${secretIndex + 1}`}
                            value={secretItem.secretName}
                            onChange={(e) => {
                              setScene((prevScene) => {
                                return produce(prevScene, (draft) => {
                                  draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings[secretIndex].secretName = e.target.value;
                                })
                              })
                              // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                              // const updatedLandmarkItems = [...scene.landmarkThings];
                              // updatedLandmarkItems[landmarkIndex].hiddenThings[
                              //   hiddenIndex
                              // ].secretThings[secretIndex].secretName = e.target.value;
                              // setScene({
                              //   ...scene,
                              //   landmarkThings: updatedLandmarkItems,
                              // });
                            }}
                            fullWidth={true}
                            variant={'outlined'}
                          />
                          <TextField
                            label={'Description'}
                            value={secretItem.secretDescription}
                            onChange={(e) => {
                              setScene((prevScene) => {
                                return produce(prevScene, (draft) => {
                                  draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings[secretIndex].secretDescription = e.target.value;
                                })
                              })
                              // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                              // const updatedLandmarkItems = [...scene.landmarkThings];
                              // updatedLandmarkItems[landmarkIndex].hiddenThings[
                              //   hiddenIndex
                              // ].secretThings[secretIndex].secretDescription = e.target.value;
                              // setScene({
                              //   ...scene,
                              //   landmarkThings: updatedLandmarkItems,
                              // });
                            }}
                            fullWidth={true}
                            variant={'outlined'}
                            multiline
                            minRows={2}
                            maxRows={Infinity}
                          />
                          <TextField
                            label={'✔️ On Success'}
                            value={secretItem.onSuccess}
                            onChange={(e) => {
                              setScene(prevScene => {
                                return produce(prevScene, (draft) => {
                                  draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings[secretIndex].onSuccess = e.target.value;
                                })
                              })
                              // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                              // const updatedLandmarkItems = [...scene.landmarkThings];
                              // updatedLandmarkItems[landmarkIndex].hiddenThings[
                              //   hiddenIndex
                              // ].secretThings[secretIndex].onSuccess = e.target.value;
                              // setScene({
                              //   ...scene,
                              //   landmarkThings: updatedLandmarkItems,
                              // });
                            }}
                            fullWidth={true}
                            variant={'outlined'}
                            multiline
                            minRows={2}
                            maxRows={Infinity}
                          />
                          <TextField
                            label={'✖️ On Failure'}
                            value={secretItem.onFailure}
                            onChange={(e) => {
                              setScene(prevScene => {
                                return produce(prevScene, (draft) => {
                                  draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings[secretIndex].onFailure = e.target.value;
                                })
                              })
                              // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                              // const updatedLandmarkItems = [...scene.landmarkThings];
                              // updatedLandmarkItems[landmarkIndex].hiddenThings[
                              //   hiddenIndex
                              // ].secretThings[secretIndex].onFailure = e.target.value;
                              // setScene({
                              //   ...scene,
                              //   landmarkThings: updatedLandmarkItems,
                              // });
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
                              disabled={hiddenItem.secretThings.length === 1}
                              onClick={() => {
                                setDeletedSecretItem(secretItem);
                                setDeletedSecretItemLandmarkIndex(landmarkIndex);
                                setDeletedSecretItemHiddenIndex(hiddenIndex);
                                setDeletedSecretItemSecretIndex(secretIndex);
                                setUndoSnackbar({ open: true });
                                setScene(prevScene => {
                                  return produce(prevScene, (draft) => {
                                    draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings = draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings.filter((_, i) => i !== secretIndex);
                                  })
                                })
                                // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                                //const updatedLandmarkItems = [...scene.landmarkThings];
                                // updatedLandmarkItems[landmarkIndex].hiddenThings[
                                //   hiddenIndex
                                // ].secretThings = updatedLandmarkItems[landmarkIndex].hiddenThings[
                                //   hiddenIndex
                                // ].secretThings.filter((_, i) => i !== secretIndex);
                                // setScene({
                                //   ...scene,
                                //   landmarkThings: updatedLandmarkItems,
                                // });
                              }}
                            >
                              <Clear />
                            </Button>
                            <Button
                              color={'primary'}
                              sx={{ width: '500%' }}
                              onClick={() => {
                                setScene(prevScene => {
                                  return produce(prevScene, (draft) => {
                                    draft.landmarkThings[landmarkIndex].hiddenThings[hiddenIndex].secretThings.splice(secretIndex + 1, 0 ,newSecretThing);
                                  })
                                })
                                // LEAVING ORIGINAL CODE AS A REMINDER OF TERRIBLE PRACTICES
                                // const updatedLandmarkItems = [...scene.landmarkThings];
                                // updatedLandmarkItems[landmarkIndex].hiddenThings[
                                //   hiddenIndex
                                // ].secretThings.splice(secretIndex + 1, 0, newSecretThing);
                                // setScene({
                                //   ...scene,
                                //   landmarkThings: updatedLandmarkItems,
                                // });
                              }}
                            >
                              <Add />
                            </Button>
                          </ButtonGroup>
                        </Stack>{' '}
                      </CardContent>
                    ))}
                  </Card>
                )}
              </React.Fragment>
            ))}
          </React.Fragment>
        ))}
      </Masonry>
      {deletedSecretItem && (
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={undoSnackbar.open}
          message="Secret thing deleted"
          action={snackbarActions}
        />
      )}
    </>
  );
};

export default SecretThingCards;
