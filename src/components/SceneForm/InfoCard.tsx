/* import { useState } from 'react'; */

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

/* const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
}); */

const InfoCard = ({
  scene,
  setScene,
}: // setSceneNoStore,
{
  scene: Scene;
  setScene: React.Dispatch<React.SetStateAction<Scene>>;
  // setSceneNoStore: React.Dispatch<React.SetStateAction<Scene>>;
}) => {
  /*   const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const isMobile = useMediaQuery('(max-width: 600px)');

  const handleSceneUpload = async () => {
      if (!uploadedFile) {
        return alert('Please select a JSON file to upload');
      }

    const reader = new FileReader();
    reader.onload = (e) => {
      console.log(e.target?.result);
      try {
        const data = JSON.parse(e.target.result);
        setScene(data);
        setUploadedFile(null);
      } catch (error) {
        console.error('Error parsing JSON:', error);
        alert('Invalid JSON file format');
      }
    };
    reader.readAsText(uploadedFile);
  }; */

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
        {/* <ButtonGroup
          fullWidth={true}
          size={`large`}
          variant={`contained`}
          orientation={isMobile ? 'vertical' : 'horizontal'}
          sx={{ mb: 2 }}
        >
          <Button
            component="label"
            color="info"
            variant="contained"
            tabIndex={-1}
            onClick={(e) => {
              e.stopPropagation();
              handleSceneUpload();
            }}
          >
            Upload File
            <VisuallyHiddenInput
              type="file"
              accept=".json"
              onChange={(event) => setUploadedFile(event.target.files[0])}
            />
          </Button>
          <Button
            color={`warning`}
            onClick={saveSceneToJson}
          >
            Save Scene to JSON
          </Button>
        </ButtonGroup> */}
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
