import express from 'express';

import scenesController from '../controllers/scenesController';

const router = express.Router();

router.get('/', scenesController.getScenes);
router.get('/:id', scenesController.getSceneById);
router.get('/:userId', scenesController.getScenesByUser);
router.post('/', scenesController.createScene);
router.put('/:id', scenesController.updateScene);
router.delete('/:id', scenesController.deleteScene);

export default router;
