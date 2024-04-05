import {
  useEffect,
  useState,
} from 'react';

import {
  Container,
  Stack,
} from '@mui/material';

import FormNav from '../components/FormNav';
import HiddenThingCards from '../components/HiddenThingCards';
import LandmarkThingCards from '../components/LandmarkThingCards';
import SceneCard from '../components/SceneCard';
import SecretThingCards from '../components/SecretThingCards';
import { generateScenePdf } from '../utils/generateScenePdf';

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

  useEffect(() => {
    const storedScene = localStorage.getItem('scene');
    if (storedScene) {
      const parsedScene = JSON.parse(storedScene);
      if (!Array.isArray(parsedScene.landmarkThings)) {
        parsedScene.landmarkThings = [];
      }
      setScene(parsedScene);
    }
  }, []);

  const setSceneAndStore = (newScene: React.SetStateAction<Scene>) => {
    if (typeof newScene === 'function') {
      setScene((prevScene) => {
        const updatedScene = newScene(prevScene);
        localStorage.setItem('scene', JSON.stringify(updatedScene));
        return updatedScene;
      });
    } else {
      setScene(newScene);
      localStorage.setItem('scene', JSON.stringify(newScene));
    }
  };

  const handleGenerateScenePdf = () => {
    generateScenePdf(scene);
  };

  return (
    <form>
      <Container
        maxWidth={'xl'}
        sx={{
          py: 8,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'start',
        }}
      >
        <Stack
          spacing={4}
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
        >
          {formStep === 0 && (
            <SceneCard
              scene={scene}
              setScene={setSceneAndStore}
            />
          )}
          {formStep === 1 && (
            <LandmarkThingCards
              scene={scene}
              setScene={setSceneAndStore}
            />
          )}
          {formStep === 2 && (
            <HiddenThingCards
              scene={scene}
              setScene={setSceneAndStore}
            />
          )}
          {formStep === 3 && (
            <SecretThingCards
              scene={scene}
              setScene={setSceneAndStore}
            />
          )}
          <FormNav
            formStep={formStep}
            setFormStep={setFormStep}
            generateScenePdf={handleGenerateScenePdf}
          />
        </Stack>
      </Container>
    </form>
  );
};

export default SceneForm;
