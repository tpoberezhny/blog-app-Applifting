import { Request, Response } from "express";
import Article from "../models/Article";
import mongoose from "mongoose";
import { AuthRequest } from "../middleware/auth";
import multer from "multer";

interface MulterRequest extends Request {
  file?: Express.Multer.File;
}

const upload = multer({ storage: multer.memoryStorage() });

export const getAllArticles = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const articles = await Article.find()
      .populate("author", "name")
      .sort({ createdAt: -1 })
      .select("title content author imageUrl commentsCount updatedAt");
    res.status(200).json(articles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createArticle = [
  upload.single("image"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      const authReq = req as AuthRequest;
      const { title, content } = req.body;

      // Check if user is authorized
      if (!authReq.user || !authReq.user.id) {
        res
          .status(401)
          .json({ message: "Unauthorized: Missing user information" });
        return;
      }

      // Check if title and content are provided
      if (!title || !content) {
        res.status(400).json({ message: "Title and content are required" });
        return;
      }

      let imageUrl = "";

      // Handle file upload
      if (req.file) {
        try {
          imageUrl = `data:${
            req.file.mimetype
          };base64,${req.file.buffer.toString("base64")}`;
        } catch (fileError) {
          res.status(500).json({ message: "Error while processing image" });
          return;
        }
      }
      const article = new Article({
        title,
        content,
        author: authReq.user.id,
        imageUrl,
      });

      await article.save();

      res.status(201).json(article);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

export const getArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      res.status(400).json({ message: "Invalid article ID" });
      return;
    }
    const article = await Article.findById(req.params.articleId).populate(
      "author",
      "name"
    );
    if (!article) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    res.status(200).json(article);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateArticleById = [
  upload.single("image"),
  async (req: MulterRequest, res: Response): Promise<void> => {
    try {
      if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
        res.status(400).json({ message: "Invalid article ID" });
        return;
      }
      const authReq = req as AuthRequest;
      if (!authReq.user || !authReq.user.id) {
        res
          .status(401)
          .json({ message: "Unauthorized: Missing user information" });
        return;
      }
      const { title, content, deleteImage } = req.body;

      if (!title || !content) {
        res.status(400).json({ message: "Title and content are required" });
        return;
      }
      let updateData: any = { title, content };

      if (deleteImage === "true") {
        updateData.imageUrl = "";
      }

      if (req.file) {
        updateData.imageUrl = `data:${
          req.file.mimetype
        };base64,${req.file.buffer.toString("base64")}`;
      }

      const updatedArticle = await Article.findByIdAndUpdate(
        req.params.articleId,
        updateData,
        { new: true }
      );

      if (!updatedArticle) {
        res.status(404).json({ message: "Article not found" });
        return;
      }

      res.status(200).json(updatedArticle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },
];

export const deleteArticleById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.articleId)) {
      res.status(400).json({ message: "Invalid article ID" });
      return;
    }
    const deletedArticle = await Article.findByIdAndDelete(
      req.params.articleId
    );
    if (!deletedArticle) {
      res.status(404).json({ message: "Article not found" });
      return;
    }
    res.status(200).json({ message: "Article deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
