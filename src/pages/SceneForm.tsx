import { useState } from 'react';

import {
  Container,
  Stack,
} from '@mui/material';

import ElementCard from '../components/ElementCard';
import SceneCard from '../components/SceneCard';

export type Scene = {
  info: {
    name: string;
    description: string;
    movement: string;
    flavor: string;
  };
  landmarkElements: {
    name: string;
    description: string;
  }[];
  hiddenElements: {
    name: string;
    description: string;
  }[];
  secretElements: {
    name: string;
    description: string;
  }[];
};

const SceneForm = () => {
  // const [formStep, setFormStep] = useState(0);
  const [scene, setScene] = useState<Scene>({
    info: {
      name: '',
      description: '',
      movement: '',
      flavor: '',
    },
    landmarkElements: [
      {
        name: '',
        description: '',
      },
    ],
    hiddenElements: [
      {
        name: '',
        description: '',
      },
    ],
    secretElements: [
      {
        name: '',
        description: '',
      },
    ],
  });

  return (
    <Container
      maxWidth={'xs'}
      sx={{ my: 4 }}
    >
      <form>
        <Stack spacing={4}>
          <SceneCard
            scene={scene}
            setScene={setScene}
          />
          <ElementCard
            scene={scene}
            setScene={setScene}
            theseElements={'landmarkElements'}
          />
          <ElementCard
            scene={scene}
            setScene={setScene}
            theseElements={'hiddenElements'}
          />
          <ElementCard
            scene={scene}
            setScene={setScene}
            theseElements={'secretElements'}
          />
        </Stack>
      </form>
    </Container>
  );
};

export default SceneForm;
