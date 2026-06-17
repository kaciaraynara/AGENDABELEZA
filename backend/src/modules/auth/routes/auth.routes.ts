import { Router } from 'express';
import { auth } from '../../../middlewares/auth';
import { AuthController } from '../controllers/auth.controller';

const authRoutes = Router();

authRoutes.post('/register', AuthController.register);
authRoutes.post('/login', AuthController.login);
authRoutes.get('/me', auth, AuthController.me);

export default authRoutes;
