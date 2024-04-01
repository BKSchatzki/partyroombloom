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

const HiddenThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const newHiddenThing = {
    hiddenName: '',
    hiddenDescription: '',
    hasSecret: false,
    secretThings: null,
  };

  return (
    <Grid container>
      {scene.landmarkThings.map((landmarkItem, landmarkIndex) => (
        <Grid
          key={landmarkIndex}
          item
          xs={12}
          sm={6}
          md={4}
        >
          <Card sx={{ mx: 1, my: 1 }}>
            <CardHeader
              title={landmarkItem.landmarkName || `Landmark Thing ${landmarkIndex + 1}`}
            />
            <Divider />
            {landmarkItem.hiddenThings.map((hiddenItem, hiddenIndex) => (
              <CardContent key={hiddenIndex}>
                <Stack spacing={2}>
                  <TextField
                    label={'Hidden Thing'}
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
                    label={'Hidden Description'}
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
                        const updatedLandmarkItems = [...scene.landmarkThings];
                        updatedLandmarkItems[landmarkIndex].hiddenThings = updatedLandmarkItems[
                          landmarkIndex
                        ].hiddenThings.filter((_, i) => i !== hiddenIndex);
                        setScene({
                          ...scene,
                          landmarkThings: updatedLandmarkItems,
                        });
                      }}
                    >
                      <Clear />
                    </Button>
                    <Button
                      color={'success'}
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
        </Grid>
      ))}
    </Grid>
  );
};

export default HiddenThingCards;
