import { Router } from 'express';
import { characterController } from '../controllers/characterController';
import { authMiddleware } from '../middleware/auth';
import { uploadAvatar } from '../middleware/upload';

const router = Router();

router.use(authMiddleware);

router.get('/', characterController.getAll.bind(characterController));
router.get('/:id', characterController.getById.bind(characterController));
router.post('/', characterController.create.bind(characterController));
router.post('/generate', characterController.generate.bind(characterController));
router.post('/:id/avatar', uploadAvatar.single('avatar'), characterController.uploadAvatar.bind(characterController));
router.put('/:id', characterController.update.bind(characterController));
router.delete('/:id', characterController.delete.bind(characterController));

export default router;
