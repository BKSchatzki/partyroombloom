import React from 'react';

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
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Scene } from '../../pages/SceneForm';

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
      </Masonry>
    </>
  );
};

export default LandmarkThingCards;
