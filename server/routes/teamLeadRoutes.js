import express from 'express';
import { protect} from '../middlewares/authMiddleware.js';
import { getAllEmployees } from '../controllers/teamLeadController.js';

const router = express.Router();

router.get('/employees',protect , getAllEmployees);


export default router;