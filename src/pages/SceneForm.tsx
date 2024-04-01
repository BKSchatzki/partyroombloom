import { useState } from 'react';

import { Container, Stack } from '@mui/material';

import FormNav from '../components/FormNav';
import HiddenThingCards from '../components/HiddenThingCards';
import LandmarkThingCards from '../components/LandmarkThingCards';
import SceneCard from '../components/SceneCard';
import SecretThingCards from '../components/SecretThingCards';

export type Scene = {
  info: {
    name: string;
    description: string;
    movement: string;
    flavor: string;
  };
  landmarkThings: {
    landmarkName: string;
    landmarkDescription: string;
    hiddenThings: {
      hiddenName: string;
      hiddenDescription: string;
      hasSecret: boolean;
      secretThings: {
        secretName: string;
        secretDescription: string;
        onSuccess: string;
        onFailure: string;
      }[];
    }[];
  }[];
};

const SceneForm = () => {
  const [formStep, setFormStep] = useState(0);
  const [scene, setScene] = useState<Scene>({
    info: {
      name: '',
      description: '',
      movement: '',
      flavor: '',
    },
    landmarkThings: [
      {
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
      },
    ],
  });

  return (
    <form>
      <Container
        maxWidth={'xl'}
        sx={{
          py: 2,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
        }}
      >
        <Stack
          spacing={4}
          sx={{ mb: 6, display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {formStep === 0 && (
            <SceneCard
              scene={scene}
              setScene={setScene}
            />
          )}
          {formStep === 1 && (
            <LandmarkThingCards
              scene={scene}
              setScene={setScene}
            />
          )}
          {formStep === 2 && (
            <HiddenThingCards
              scene={scene}
              setScene={setScene}
            />
          )}
          {formStep === 3 && (
            <SecretThingCards
              scene={scene}
              setScene={setScene}
            />
          )}
          <FormNav
            formStep={formStep}
            setFormStep={setFormStep}
          />
        </Stack>
      </Container>
    </form>
  );
};

export default SceneForm;
