import { Card, CardContent, Container, Stack, TextField } from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const SceneCard = ({
  scene,
  setScene,
}: {
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  return (
    <Container maxWidth={'sm'}>
      <Card>
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
    </Container>
  );
};

export default SceneCard;
