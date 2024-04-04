import connectPrisma from '../utils/connectPrisma';

const prisma = connectPrisma();

const scenesController = {
  getScenes: async (req, res) => {
    try {
      const scenes = await prisma.scene.findMany({
        include: { landmarkThings: true },
      });
      res.json(scenes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching scenes' });
    }
  },
  getSceneById: async (req, res) => {
    const sceneId = req.params.id;
    try {
      const scene = await prisma.scene.findUnique({
        where: { id: sceneId },
        include: { landmarkThings: true },
      });
      res.json(scene);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching scene' });
    }
  },
  getScenesByUser: async (req, res) => {
    const userId = req.params.userId;
    try {
      const scenes = await prisma.scene.findMany({
        where: { userId: { in: [userId] } },
        include: { landmarkThings: true },
      });
      res.json(scenes);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching scenes by user' });
    }
  },
  createScene: async (req, res) => {
    const { name, description, movement, flavor, userId } = req.body;
    try {
      const newScene = await prisma.scene.create({
        data: {
          name,
          description,
          movement,
          flavor,
          userId: userId,
        },
      });
      res.json(newScene);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error creating scene' });
    }
  },
  updateScene: async (req, res) => {
    const sceneId = req.params.id;
    const { name, description, movement, flavor } = req.body;
    try {
      const updatedScene = await prisma.scene.update({
        where: { id: sceneId },
        data: {
          name,
          description,
          movement,
          flavor,
        },
      });
      res.json(updatedScene);
    } catch (error) {
      console.error(error);
      res.status(400).json({ message: 'Error updating scene' });
    }
  },
  deleteScene: async (req, res) => {
    const sceneId = req.params.id;
    try {
      await prisma.scene.delete({ where: { id: sceneId } });
      res.json({ message: 'Scene deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting scene' });
    }
  },
};

export default scenesController;
