import express from 'express';
import { signup, login ,getProfile } from '../controllers/authController.js';
import { protect} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.route("/curr-user").get(protect, getProfile)
export default router;
