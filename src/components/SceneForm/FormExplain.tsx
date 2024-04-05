import React, { useState } from 'react';

import { FilterVintage } from '@mui/icons-material';
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from '@mui/material';

// import { Scene } from '../../pages/SceneForm';

const FormExplain = (/* {
  scene,
  setSceneNoStore,
}: {
  scene: Scene;
  setSceneNoStore: React.Dispatch<React.SetStateAction<Scene>>;
} */) => {
  const [expanded, setExpanded] = useState<string | false>('panel0');

  const handleChange = (panel: string) => (e: React.SyntheticEvent, newExpanded: boolean) => {
    e.preventDefault();
    setExpanded(newExpanded ? panel : false);
  };

  return (
    <>
      <Accordion
        variant={'outlined'}
        expanded={expanded === 'panel0'}
        onChange={handleChange('panel0')}
      >
        <AccordionSummary expandIcon={<FilterVintage />}>
          <Typography
            variant={'h3'}
            fontWeight={'bold'}
            fontSize={'1.2rem'}
          >
            PartyRoomBloom?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          PartyRoomBloom is a planning tool for tabletop role-playing games based on{' '}
          <Link
            href={'https://diyanddragons.blogspot.com/2019/10/landmark-hidden-secret.html'}
            target={'_blank'}
            rel={'noreferrer noopener'}
          >
            this excellent article
          </Link>{' '}
          that aims to assist game masters in creating compelling sequences that keep their players
          engaged.
        </AccordionDetails>
        <AccordionDetails>
          The principle is simple. Information is presented in three layers:
          <List>
            <ListItem>
              <ListItemIcon>📍</ListItemIcon>
              <ListItemText>
                <Typography variant={'body2'}>
                  <strong>Landmark</strong>: immediately noticeable elements players can choose to
                  interact with more closely (e.g. a table, large fixture, door, etc.)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>🔎</ListItemIcon>
              <ListItemText>
                <Typography variant={'body2'}>
                  <strong>Hidden</strong>: elements players will notice when interacting with a
                  landmark item (e.g. a candle on a table, a design on a wall, a lock on a chest,
                  etc.)
                </Typography>
              </ListItemText>
            </ListItem>
            <ListItem>
              <ListItemIcon>🎲</ListItemIcon>
              <ListItemText>
                <Typography variant={'body2'}>
                  <strong>Secret</strong>: elements players will only see either with a roll or
                  clever play (e.g. a sunken plate under the candle, hinges on the painting, the
                  code to a combination lock, etc.)
                </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </AccordionDetails>
        <AccordionDetails>
          This location design creates a network of interacting elements that players can navigate
          through, drilling down to find an encounter, information, loot, a trap, or something else.
        </AccordionDetails>
      </Accordion>
      <Accordion
        variant={'outlined'}
        sx={{ mb: 2 }}
        expanded={expanded === 'panel1'}
        onChange={handleChange('panel1')}
      >
        <AccordionSummary expandIcon={<FilterVintage />}>
          <Typography
            variant={'h3'}
            fontWeight={'bold'}
            fontSize={'1.2rem'}
          >
            Need an example?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          Or feel free to watch{' '}
          <Link
            href={'https://www.youtube.com/watch?v=Sd2svbU7t50'}
            target={'_blank'}
            rel={'noreferrer noopener'}
          >
            this wonderful video
          </Link>{' '}
          while using this tool to follow along. Remember to export the form to a PDF at the end so
          that you can print it out for your sessions!
        </AccordionDetails>
      </Accordion>
    </>
  );
};

export default FormExplain;
