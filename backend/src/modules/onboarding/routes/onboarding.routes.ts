import { Router } from 'express';
import { getStatus } from '../controllers/onboarding.controller';
import { auth } from '../../../middlewares/auth';

const router = Router();

router.use(auth);
router.get('/status', getStatus);

export default router;
