import express from 'express';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import teamLeadRoutes from './routes/teamLeadRoutes.js';
import cors from 'cors';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());


app.use('/api/auth', authRoutes);
app.use("/api/teamlead", teamLeadRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
