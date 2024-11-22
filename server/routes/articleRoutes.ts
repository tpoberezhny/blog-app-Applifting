import express from 'express';
import {
  getAllArticles,
  createArticle,
  getArticleById,
  updateArticleById,
  deleteArticleById
} from '../controllers/articleController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get all articles
router.get('/articles', getAllArticles);

// Create a new article (Protected)
router.post('/articles', authMiddleware, createArticle);

// Get an article by ID
router.get('/articles/:articleId', getArticleById);

// Update an article by ID (Protected)
router.patch('/articles/:articleId', authMiddleware, updateArticleById);

// Delete an article by ID (Protected)
router.delete('/articles/:articleId', authMiddleware, deleteArticleById);

export default router;