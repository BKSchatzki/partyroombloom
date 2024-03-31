import React from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Stack,
  TextField,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const ElementCard = ({
  scene,
  setScene,
  theseElements,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  theseElements: 'landmarkElements' | 'hiddenElements' | 'secretElements';
}) => {
  const newElement = {
    name: '',
    description: '',
  };

  return (
    <Card>
      <CardHeader
        title={
          theseElements === 'landmarkElements'
            ? 'Landmark Elements'
            : theseElements === 'hiddenElements'
            ? 'Hidden Elements'
            : theseElements === 'secretElements'
            ? 'Secret Elements'
            : ''
        }
      />
      <Divider />
      <CardContent>
        <Stack spacing={4}>
          {scene[theseElements].map((item, index) => (
            <Stack
              spacing={2}
              key={index}
            >
              <TextField
                label={'Element'}
                value={item.name}
                onChange={(e) => {
                  const updatedItems = [...scene[theseElements]];
                  updatedItems[index].name = e.target.value;
                  setScene({
                    ...scene,
                    [theseElements]: updatedItems,
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
              />
              <TextField
                label={'Details'}
                value={item.description}
                onChange={(e) => {
                  const updatedItems = [...scene[theseElements]];
                  updatedItems[index].description = e.target.value;
                  setScene({
                    ...scene,
                    [theseElements]: updatedItems,
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
                multiline
                minRows={2}
                maxRows={Infinity}
              />
              <ButtonGroup
                size={'large'}
                color={'inherit'}
                variant={'text'}
                fullWidth={true}
              >
                <Button
                  color={'error'}
                  disabled={index === 0}
                  onClick={() => {
                    const updatedItems = [...scene[theseElements].filter((_, i) => i !== index)];
                    setScene({
                      ...scene,
                      [theseElements]: updatedItems,
                    });
                  }}
                >
                  Delete
                </Button>
                <Button
                  color={'primary'}
                  sx={{ width: '200%' }}
                  onClick={() => {
                    const updatedItems = [...scene[theseElements]];
                    const itemIndex = index;
                    updatedItems.splice(itemIndex + 1, 0, newElement);
                    setScene({
                      ...scene,
                      [theseElements]: updatedItems,
                    });
                  }}
                >
                  Add
                </Button>
              </ButtonGroup>
            </Stack>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default ElementCard;
