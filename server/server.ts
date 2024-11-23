import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import articleRoutes from './routes/articleRoutes';
import commentRoutes from './routes/commentRoutes';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/articles', articleRoutes);
app.use('/api/articles/:articleId/comments', commentRoutes);
app.use('/api/users', userRoutes);

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const DB_URI = process.env.MONGO_URI as string;

mongoose.connect(DB_URI, {})
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((error) => console.log(error.message));