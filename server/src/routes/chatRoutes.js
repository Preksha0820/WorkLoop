import express from 'express';
import { getChatWithUser, deleteChatHistory } from '../controllers/chatController.js';
import { protect } from '../middlewares/authMiddleware.js';
import e from 'express';


const router = express.Router();


router.route('/:userId').get(protect ,getChatWithUser);
router.route('/:userId').delete(protect, deleteChatHistory);

export default router;