import {
  Card,
  CardContent,
  Container,
  Stack,
  TextField,
  Typography,
} from '@mui/material';

import type { Scene } from '../../pages/SceneForm';
import FormExplain from './FormExplain';

const InfoCard = ({
  scene,
  setScene,
}: // setSceneNoStore,
{
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  // setSceneNoStore: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
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
