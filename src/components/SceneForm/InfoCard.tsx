import React from 'react';

import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';

import { sceneInit } from '../../data/sceneInit';
import type { Scene } from '../../pages/SceneForm';
import { saveSceneToJson } from '../../utils/saveScenetoJson';
import FormExplain from './FormExplain';

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

const InfoCard = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  const isMobile = useMediaQuery('(max-width: 600px)');

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
    <>
      <Typography
        variant={`h2`}
        fontSize={`1.8rem`}
        fontWeight={`bold`}
        sx={{ pt: 2 }}
      >
        Let's Set the Scene!
      </Typography>
      <Container maxWidth={'sm'}>
        <ButtonGroup
          fullWidth={true}
          size={`large`}
          variant={`text`}
          color={`inherit`}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 2 }}
        >
          <Button
            color={`primary`}
            component={`label`}
            role={undefined}
            tabIndex={-1}
          >
            Upload Scene
            <VisuallyHiddenInput
              type="file"
              accept=".json"
              onChange={(event) => handleSceneUpload(event)}
            />
          </Button>
          <Button
            color={`warning`}
            onClick={saveSceneToJson}
          >
            Save Scene
          </Button>
          <Button
            color={`error`}
            onClick={() => setScene(sceneInit)}
          >
            Reset Scene
          </Button>
        </ButtonGroup>
        <Card variant={'outlined'}>
          <CardContent>
            <Stack spacing={2}>
              <TextField
                label={'Location'}
                value={scene.info.name}
                onChange={(e) => {
                  setScene({
                    ...scene,
                    info: {
                      ...scene.info,
                      name: e.target.value,
                    },
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
              />
              <TextField
                label={'Description'}
                value={scene.info.description}
                onChange={(e) => {
                  setScene({
                    ...scene,
                    info: {
                      ...scene.info,
                      description: e.target.value,
                    },
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
              />
              <TextField
                label={'Movement'}
                value={scene.info.movement}
                onChange={(e) => {
                  setScene({
                    ...scene,
                    info: {
                      ...scene.info,
                      movement: e.target.value,
                    },
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
                multiline
                minRows={2}
                maxRows={Infinity}
              />
              <TextField
                label={'Flavor'}
                value={scene.info.flavor}
                onChange={(e) => {
                  setScene({
                    ...scene,
                    info: {
                      ...scene.info,
                      flavor: e.target.value,
                    },
                  });
                }}
                fullWidth={true}
                variant={'outlined'}
                multiline
                minRows={2}
                maxRows={Infinity}
              />
            </Stack>
          </CardContent>
        </Card>
        <FormExplain
        // scene={scene}
        // setSceneNoStore={setSceneNoStore}
        />
      </Container>
    </>
  );
};

export default InfoCard;
