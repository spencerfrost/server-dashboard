import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { dockerRouter } from './routes/docker';
import { systemRouter } from './routes/system';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/system', systemRouter);
app.use('/api/docker', dockerRouter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});