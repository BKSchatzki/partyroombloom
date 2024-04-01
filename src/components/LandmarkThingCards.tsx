import React from 'react';

import { Add, Clear } from '@mui/icons-material';
import { Button, ButtonGroup, Card, CardContent, Grid, Stack, TextField } from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const LandmarkThingCards = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const newLandmarkThing = {
    landmarkName: '',
    landmarkDescription: '',
    hiddenThings: [
      {
        hiddenName: '',
        hiddenDescription: '',
        hasSecret: false,
        secretThings: null,
      },
    ],
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
            <CardContent>
              <Stack spacing={2}>
                <TextField
                  label={'Landmark Thing'}
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
                  label={'Landmark Description'}
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
                  variant={'contained'}
                  fullWidth={true}
                >
                  {/* {index !== 0 && ( */}
                  <Button
                    color={'error'}
                    disabled={scene.landmarkThings.length === 1}
                    onClick={() => {
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
                  {/* )} */}
                  <Button
                    color={'success'}
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
        </Grid>
      ))}
    </Grid>
  );
};

export default LandmarkThingCards;
