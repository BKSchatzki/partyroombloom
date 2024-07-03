import { saveAs } from 'file-saver';
import {
  breakTextIntoLines,
  PDFDocument,
  rgb,
  StandardFonts,
} from 'pdf-lib';

import type { Scene } from '../pages/SceneForm';

export const generateScenePdf = async (scene: Scene) => {
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

  const sceneTitle = `${scene.info.name || 'Location'} (${
    scene.info.description || 'Description'
  })`;
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

  const sceneMood = `${scene.info.flavor || 'Flavor and'} ${scene.info.movement || 'Movement'}`;
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
    const landmarkName = `${landmarkItem.landmarkName || 'Landmark Thing'}`;
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

    const landmarkDescription = `${landmarkItem.landmarkDescription || 'Description'}`;
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
      const hiddenName = `> ${hiddenItem.hiddenName || 'Hidden Thing'}`;
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

      const hiddenDescription = `${hiddenItem.hiddenDescription || 'Description'}`;
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
          const secretName = `? ${secretItem.secretName || 'Secret Thing'}`;
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

          const secretDescription = `${secretItem.secretDescription || 'Description'}`;
          page.drawText(secretDescription, {
            x: MARGIN + 40,
            y: yPosition,
            size: FONT_PARAGRAPH,
            font: helveticaRegular,
            lineHeight: FONT_PARAGRAPH_LINE,
            maxWidth: MAX_WIDTH - 40,
          });
          currentLineCount = breakTextIntoLines(secretDescription, [' '], MAX_WIDTH - 40, (text) =>
            helveticaRegular.widthOfTextAtSize(text, FONT_PARAGRAPH)
          ).length;
          yPosition -= FONT_PARAGRAPH_LINE * currentLineCount;
          checkAndAddPage();

          const onSuccess = `$ ${secretItem.onSuccess || 'On Success'}`;
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

          const onFailure = `X ${secretItem.onFailure || 'On Failure'}`;
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
  const lowercasedName = scene.info.name.toLowerCase() || 'untitled';
  const sanitizedDescription =
    scene.info.description
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/ /g, '-') || 'undescribed';
  const fileName = `${lowercasedName}-${sanitizedDescription}-${new Date()
    .toISOString()
    .slice(0, 10)
    .replace(/-/g, '')}.pdf`;
  saveAs(blob, fileName);
};
