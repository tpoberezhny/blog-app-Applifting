import { Schema, model } from 'mongoose';

const ArticleSchema = new Schema({
  title: { type: String, required: true },
  perex: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: String, required: true },
  published: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export default model('Article', ArticleSchema);