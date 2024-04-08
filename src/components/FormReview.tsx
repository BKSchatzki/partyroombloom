import { Masonry } from '@mui/lab';
import {
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

import type { Scene } from '../pages/SceneForm';

const FormReview = ({ scene }: { scene: Scene }) => {
  return (
    <>
      <Typography
        variant={`h3`}
        fontSize={`1.8rem`}
        fontWeight={`bold`}
        sx={{ pt: 2 }}
      >
        Scene Review
      </Typography>
      <Masonry
        columns={{ xs: 1, sm: 2, md: 3 }}
        sequential
      >
        <Card variant={`outlined`}>
          <CardContent>
            <Stack spacing={2}>
              <Typography
                variant={`h4`}
                fontSize={`1.5rem`}
                fontWeight={`bold`}
              >
                {scene.info.name || 'Location'} ({scene.info.description || 'Description'})
              </Typography>
              <Typography
                variant={`subtitle1`}
                fontStyle={`italic`}
              >
                {scene.info.flavor || 'Flavor and'} {scene.info.movement || 'Movement'}
              </Typography>
            </Stack>
          </CardContent>
        </Card>
        {scene.landmarkThings.map((landmarkItem, landmarkIndex) => (
          <Card
            key={landmarkIndex}
            sx={{ mx: 1, my: 1 }}
            elevation={1}
          >
            <CardContent>
              <Stack spacing={2}>
                <Typography
                  variant={`h4`}
                  fontSize={`1.2rem`}
                  fontWeight={`bold`}
                >
                  📍 {landmarkItem.landmarkName || 'Landmark Thing'}
                </Typography>
                <Typography
                  variant={`subtitle2`}
                  fontStyle={`italic`}
                >
                  {landmarkItem.landmarkDescription || 'Description'}
                </Typography>
                {landmarkItem.hiddenThings.map((hiddenItem, hiddenIndex) => (
                  <Card
                    key={hiddenIndex}
                    sx={{ mx: 1, my: 1 }}
                    elevation={4}
                  >
                    <CardContent>
                      <Stack spacing={2}>
                        <Typography
                          variant={`h5`}
                          fontSize={`1.1rem`}
                          fontWeight={`bold`}
                        >
                          🔎 {hiddenItem.hiddenName || 'Hidden Thing'}
                        </Typography>
                        <Typography variant={`subtitle2`}>
                          {hiddenItem.hiddenDescription || 'Description'}
                        </Typography>
                        {hiddenItem.hasSecret &&
                          hiddenItem.secretThings.map((secretItem, secretIndex) => (
                            <Card
                              key={secretIndex}
                              sx={{ mx: 1, my: 1 }}
                              elevation={16}
                            >
                              <CardContent>
                                <Stack spacing={2}>
                                  <Typography
                                    variant={`h6`}
                                    fontSize={`1rem`}
                                    fontWeight={`bold`}
                                  >
                                    🔒 {secretItem.secretName || 'Secret Thing'}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    {secretItem.secretDescription || 'Description'}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    ✔️ {secretItem.onSuccess || 'On Success'}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    ✖️ {secretItem.onFailure || 'On Failure'}
                                  </Typography>
                                </Stack>
                              </CardContent>
                            </Card>
                          ))}
                      </Stack>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            </CardContent>
          </Card>
        ))}
      </Masonry>
    </>
  );
};

export default FormReview;
