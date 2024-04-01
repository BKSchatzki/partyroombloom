import React from 'react';

import { Add, Clear } from '@mui/icons-material';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Grid,
  Stack,
  TextField,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const SecretThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const newSecretThing = {
    secretName: '',
    secretDescription: '',
    onSuccess: '',
    onFailure: '',
  };

  return (
    <Grid container>
      {scene.landmarkThings.map((landmarkItem, landmarkIndex) => (
        <React.Fragment key={landmarkIndex}>
          {landmarkItem.hiddenThings.map((hiddenItem, hiddenIndex) => (
            <React.Fragment key={landmarkIndex}>
              {hiddenItem.hasSecret && (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                >
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
                            label={`🎲 Secret Thing ${secretIndex + 1}`}
                            value={secretItem.secretName}
                            onChange={(e) => {
                              const updatedLandmarkItems = [...scene.landmarkThings];
                              updatedLandmarkItems[landmarkIndex].hiddenThings[
                                hiddenIndex
                              ].secretThings[secretIndex].secretName = e.target.value;
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
                            value={secretItem.secretDescription}
                            onChange={(e) => {
                              const updatedLandmarkItems = [...scene.landmarkThings];
                              updatedLandmarkItems[landmarkIndex].hiddenThings[
                                hiddenIndex
                              ].secretThings[secretIndex].secretDescription = e.target.value;
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
                          <TextField
                            label={'✔️ On Success'}
                            value={secretItem.onSuccess}
                            onChange={(e) => {
                              const updatedLandmarkItems = [...scene.landmarkThings];
                              updatedLandmarkItems[landmarkIndex].hiddenThings[
                                hiddenIndex
                              ].secretThings[secretIndex].onSuccess = e.target.value;
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
                          <TextField
                            label={'✖️ On Failure'}
                            value={secretItem.onFailure}
                            onChange={(e) => {
                              const updatedLandmarkItems = [...scene.landmarkThings];
                              updatedLandmarkItems[landmarkIndex].hiddenThings[
                                hiddenIndex
                              ].secretThings[secretIndex].onFailure = e.target.value;
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
                                const updatedLandmarkItems = [...scene.landmarkThings];
                                updatedLandmarkItems[landmarkIndex].hiddenThings[
                                  hiddenIndex
                                ].secretThings = updatedLandmarkItems[landmarkIndex].hiddenThings[
                                  hiddenIndex
                                ].secretThings.filter((_, i) => i !== secretIndex);
                                setScene({
                                  ...scene,
                                  landmarkThings: updatedLandmarkItems,
                                });
                              }}
                            >
                              <Clear />
                            </Button>
                            <Button
                              color={'primary'}
                              sx={{ width: '500%' }}
                              onClick={() => {
                                const updatedLandmarkItems = [...scene.landmarkThings];
                                updatedLandmarkItems[landmarkIndex].hiddenThings[
                                  hiddenIndex
                                ].secretThings.splice(secretIndex + 1, 0, newSecretThing);
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
                </Grid>
              )}
            </React.Fragment>
          ))}
        </React.Fragment>
      ))}
    </Grid>
  );
};

export default SecretThingCards;
