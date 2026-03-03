import { Router } from 'express';
import { gameSessionController } from '../controllers/gameSessionController';
import { authMiddleware } from '../middleware/auth';

const router = Router();

router.use(authMiddleware);

router.get('/', gameSessionController.getAll.bind(gameSessionController));
router.get('/:id', gameSessionController.getById.bind(gameSessionController));
router.post('/', gameSessionController.create.bind(gameSessionController));
router.post('/:id/join', gameSessionController.join.bind(gameSessionController));
router.post('/:id/leave', gameSessionController.leave.bind(gameSessionController));
router.post('/:id/start', gameSessionController.start.bind(gameSessionController));
router.post('/:id/end', gameSessionController.end.bind(gameSessionController));

export default router;
