import { useEffect, useState } from 'react';

import { saveAs } from 'file-saver';
import { breakTextIntoLines, PDFDocument, rgb, StandardFonts } from 'pdf-lib';

import { Button, Container, Stack } from '@mui/material';

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

  const generatePdf = async () => {
    const pdfDoc = await PDFDocument.create();

    const helveticaRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const helveticaBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const helveticaOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
    const FONT_BASE = 12;
    const FONT_HEADING = 16;
    const FONT_PARAGRAPH = 10;
    const FONT_BASE_LINE = FONT_BASE * 1.5;
    const FONT_HEADING_LINE = FONT_HEADING * 1.5;
    const FONT_PARAGRAPH_LINE = FONT_PARAGRAPH * 1.5;
    const FONT_BASE_PADDING = FONT_BASE * 0.5;
    const FONT_PARAGRAPH_PADDING = FONT_PARAGRAPH * 0.5;

    const PAGE_WIDTH = 595;
    const PAGE_HEIGHT = 842;
    const MARGIN = 40;
    const MAX_WIDTH = PAGE_WIDTH - MARGIN * 2;

    let page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    let currentLineCount;
    let yPosition = PAGE_HEIGHT - MARGIN * 2;

    const checkAndAddPage = () => {
      if (yPosition < MARGIN * 2) {
        page = pdfDoc.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
        yPosition = PAGE_HEIGHT - MARGIN * 2;
      }
    };

    const sceneTitle = `${scene.info.name} (${scene.info.description})`;
    page.drawText(sceneTitle, {
      x: MARGIN,
      y: yPosition,
      size: FONT_HEADING,
      font: helveticaBold,
      lineHeight: FONT_HEADING_LINE,
      maxWidth: MAX_WIDTH,
    });
    currentLineCount = breakTextIntoLines(sceneTitle, [' '], MAX_WIDTH, (text) =>
      helveticaOblique.widthOfTextAtSize(text, FONT_PARAGRAPH)
    ).length;
    yPosition -= FONT_BASE_LINE * currentLineCount;
    checkAndAddPage();

    const sceneMood = `${scene.info.flavor} ${scene.info.movement}`;
    page.drawText(sceneMood, {
      x: MARGIN,
      y: yPosition,
      size: FONT_PARAGRAPH,
      font: helveticaOblique,
      lineHeight: FONT_PARAGRAPH_LINE,
      maxWidth: MAX_WIDTH,
      color: rgb(0.3333, 0.3333, 0.3333),
    });
    currentLineCount = breakTextIntoLines(sceneMood, [' '], MAX_WIDTH, (text) =>
      helveticaOblique.widthOfTextAtSize(text, FONT_PARAGRAPH)
    ).length;
    yPosition -= FONT_PARAGRAPH_LINE * currentLineCount + FONT_PARAGRAPH_PADDING;
    checkAndAddPage();

    scene.landmarkThings.map((landmarkItem) => {
      const landmarkName = `${landmarkItem.landmarkName}`;
      page.drawText(landmarkName, {
        x: MARGIN,
        y: yPosition,
        size: FONT_BASE,
        font: helveticaBold,
        lineHeight: FONT_PARAGRAPH_LINE,
        maxWidth: MAX_WIDTH,
      });
      currentLineCount = breakTextIntoLines(landmarkName, [' '], MAX_WIDTH, (text) =>
        helveticaBold.widthOfTextAtSize(text, FONT_BASE)
      ).length;
      yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
      checkAndAddPage();

      const landmarkDescription = `${landmarkItem.landmarkDescription}`;
      page.drawText(landmarkDescription, {
        x: MARGIN,
        y: yPosition,
        size: FONT_PARAGRAPH,
        font: helveticaOblique,
        lineHeight: FONT_BASE_LINE,
        maxWidth: MAX_WIDTH,
        color: rgb(0.3333, 0.3333, 0.3333),
      });
      currentLineCount = breakTextIntoLines(landmarkDescription, [' '], MAX_WIDTH, (text) =>
        helveticaOblique.widthOfTextAtSize(text, FONT_PARAGRAPH)
      ).length;
      yPosition -= FONT_BASE_LINE * currentLineCount;
      checkAndAddPage();

      landmarkItem.hiddenThings.map((hiddenItem) => {
        const hiddenName = `> ${hiddenItem.hiddenName}`;
        page.drawText(hiddenName, {
          x: MARGIN + 20,
          y: yPosition,
          size: FONT_PARAGRAPH,
          font: helveticaBold,
          lineHeight: FONT_PARAGRAPH_LINE,
          maxWidth: MAX_WIDTH - 20,
        });
        currentLineCount = breakTextIntoLines(hiddenName, [' '], MAX_WIDTH - 20, (text) =>
          helveticaBold.widthOfTextAtSize(text, FONT_PARAGRAPH)
        ).length;
        yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
        checkAndAddPage();

        const hiddenDescription = `${hiddenItem.hiddenDescription}`;
        page.drawText(hiddenDescription, {
          x: MARGIN + 20,
          y: yPosition,
          size: FONT_PARAGRAPH,
          font: helveticaRegular,
          lineHeight: FONT_PARAGRAPH_LINE,
          maxWidth: MAX_WIDTH - 20,
        });
        currentLineCount = breakTextIntoLines(hiddenDescription, [' '], MAX_WIDTH - 20, (text) =>
          helveticaRegular.widthOfTextAtSize(text, FONT_PARAGRAPH)
        ).length;
        yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
        checkAndAddPage();

        hiddenItem.hasSecret &&
          hiddenItem.secretThings.map((secretItem) => {
            const secretName = `? ${secretItem.secretName}`;
            page.drawText(secretName, {
              x: MARGIN + 40,
              y: yPosition,
              size: FONT_PARAGRAPH,
              font: helveticaBold,
              lineHeight: FONT_PARAGRAPH_LINE,
              maxWidth: MAX_WIDTH - 40,
            });
            currentLineCount = breakTextIntoLines(secretName, [' '], MAX_WIDTH - 40, (text) =>
              helveticaBold.widthOfTextAtSize(text, FONT_PARAGRAPH)
            ).length;
            yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
            checkAndAddPage();

            const secretDescription = `${secretItem.secretDescription}`;
            page.drawText(secretDescription, {
              x: MARGIN + 40,
              y: yPosition,
              size: FONT_PARAGRAPH,
              font: helveticaRegular,
              lineHeight: FONT_PARAGRAPH_LINE,
              maxWidth: MAX_WIDTH - 40,
            });
            currentLineCount = breakTextIntoLines(
              secretDescription,
              [' '],
              MAX_WIDTH - 40,
              (text) => helveticaRegular.widthOfTextAtSize(text, FONT_PARAGRAPH)
            ).length;
            yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
            checkAndAddPage();

            const onSuccess = `$ ${secretItem.onSuccess}`;
            page.drawText(onSuccess, {
              x: MARGIN + 60,
              y: yPosition,
              size: FONT_PARAGRAPH,
              font: helveticaRegular,
              lineHeight: FONT_PARAGRAPH_LINE,
              maxWidth: MAX_WIDTH - 60,
            });
            currentLineCount = breakTextIntoLines(onSuccess, [' '], MAX_WIDTH - 60, (text) =>
              helveticaRegular.widthOfTextAtSize(text, FONT_PARAGRAPH)
            ).length;
            yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
            checkAndAddPage();

            const onFailure = `X ${secretItem.onFailure}`;
            page.drawText(onFailure, {
              x: MARGIN + 60,
              y: yPosition,
              size: FONT_PARAGRAPH,
              font: helveticaRegular,
              lineHeight: FONT_PARAGRAPH_LINE,
              maxWidth: MAX_WIDTH - 60,
            });
            currentLineCount = breakTextIntoLines(onFailure, [' '], MAX_WIDTH - 60, (text) =>
              helveticaRegular.widthOfTextAtSize(text, FONT_PARAGRAPH)
            ).length;
            yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
            checkAndAddPage();
          });
        yPosition -= FONT_PARAGRAPH_PADDING;
        checkAndAddPage();
      });
      yPosition -= FONT_BASE_PADDING;
      checkAndAddPage();
    });

    const pdfBytes = await pdfDoc.save();

    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    saveAs(blob, `scene-${new Date().toISOString()}.pdf`);
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
          <Button
            variant="contained"
            onClick={generatePdf}
          >
            Generate PDF
          </Button>
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