import { Masonry } from '@mui/lab';
import {
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

import type { Scene } from '../../pages/SceneForm';
import { saveSceneToJson } from '../../utils/saveScenetoJson';

const FormReview = ({
  scene,
  generateScenePdf,
}: {
  scene: Scene;
  generateScenePdf: () => void;
}) => {
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
                {scene.info.name} ({scene.info.description})
              </Typography>
              <Typography
                variant={`subtitle1`}
                fontStyle={`italic`}
              >
                {scene.info.flavor} {scene.info.movement}
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
                  📍 {landmarkItem.landmarkName}
                </Typography>
                <Typography
                  variant={`subtitle2`}
                  fontStyle={`italic`}
                >
                  {landmarkItem.landmarkDescription}
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
                          🔎 {hiddenItem.hiddenName}
                        </Typography>
                        <Typography variant={`subtitle2`}>
                          {hiddenItem.hiddenDescription}
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
                                    🔒 {secretItem.secretName}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    {secretItem.secretDescription}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    ✔️ {secretItem.onSuccess}
                                  </Typography>
                                  <Typography variant={`subtitle2`}>
                                    ✖️ {secretItem.onFailure}
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
        <Card sx={{ mx: 1, my: 1 }}>
          <CardContent>
            <ButtonGroup
              fullWidth={true}
              size={`large`}
              variant={`contained`}
              orientation="vertical"
            >
              <Button
                color={`success`}
                onClick={generateScenePdf}
              >
                Download PDF
              </Button>
              <Button
                color={`warning`}
                onClick={saveSceneToJson}
              >
                Save Scene to JSON
              </Button>
            </ButtonGroup>
          </CardContent>
        </Card>
      </Masonry>
    </>
  );
};

export default FormReview;
