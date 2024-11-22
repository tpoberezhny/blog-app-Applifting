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
router.get('/', getAllArticles);

// Create a new article (Protected)
router.post('/', authMiddleware, createArticle);

// Get an article by ID
router.get('/:articleId', getArticleById);

// Update an article by ID (Protected)
router.patch('/:articleId', authMiddleware, updateArticleById);

// Delete an article by ID (Protected)
router.delete('/:articleId', authMiddleware, deleteArticleById);

export default router;