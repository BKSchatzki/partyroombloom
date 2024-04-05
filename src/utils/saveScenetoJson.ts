import { saveAs } from 'file-saver';

export const saveSceneToJson = () => {
  const storedScene = localStorage.getItem('scene');
  if (storedScene) {
    const parsedScene = JSON.parse(storedScene);
    const sceneJson = JSON.stringify(parsedScene, null, 2);
    const blob = new Blob([sceneJson], { type: 'application/json' });
    const lowercasedName = parsedScene.info.name.toLowerCase();
    const adjectives = parsedScene.info.description
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/ /g, '-');
    const fileName = `${lowercasedName}-${adjectives}-${new Date()
      .toISOString()
      .slice(0, 10)
      .replace(/-/g, '')}.json`;
    saveAs(blob, fileName);
  }
};
