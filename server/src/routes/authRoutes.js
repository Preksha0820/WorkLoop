import express from 'express';
import { signup, login, getProfile, verifyInvitation } from '../controllers/authController.js';
import { protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.route("/curr-user").get(protect, getProfile);
router.get('/verify-invitation/:token', verifyInvitation);
export default router;
