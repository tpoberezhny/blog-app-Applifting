import { Request, Response } from 'express';
import Article from '../models/Article';
import mongoose from 'mongoose';
import { AuthRequest } from '../middleware/auth';

export const getAllArticles = async (req: Request, res: Response): Promise<void> => {
  try {
    const articles = await Article.find()
    .populate('author', 'name')
    .sort({ createdAt: -1 })
    .select('title perex author imageUrl commentsCount updatedAt');
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthRequest;
    const { title, perex, content } = req.body;

    if (!authReq.user || !authReq.user.id || !authReq.user.name) {
      res.status(401).json({ message: 'Unauthorized: Missing user information' });
      return;
    }

    if (!title || !perex || !content) {
      res.status(400).json({ message: 'Title, perex, and content are required' });
      return;
    }

    const article = new Article({ title, perex, content, author: authReq.user.id });
    await article.save();
    res.status(201).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }
    const article = await Article.findById(req.params.articleId).populate('author', 'name');
    if (!article) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }
    const updatedArticle = await Article.findByIdAndUpdate(req.params.articleId, req.body, { new: true });
    if (!updatedArticle) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.status(200).json(updatedArticle);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteArticleById = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      res.status(400).json({ message: 'Invalid article ID' });
      return;
    }
    const deletedArticle = await Article.findByIdAndDelete(req.params.articleId);
    if (!deletedArticle) {
      res.status(404).json({ message: 'Article not found' });
      return;
    }
    res.status(200).json({ message: 'Article deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};