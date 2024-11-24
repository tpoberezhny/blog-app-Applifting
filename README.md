# Applifting Blog - Tymofii Poberezhnyi

![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

## Table of Contents
- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)

## Overview
This project is a full-featured blog application where users can create, edit, delete, and comment (vote up/down) on articles. The app provides a predefined user with credentials, supporting features such as image uploads and Markdown formatting for article content (implemented for Create Article only).

## Technologies Used

### Frontend
- **Framework**: React (with TypeScript)
- **State Management**: Redux Toolkit (RTK)
- **HTTP Requests**: Axios
- **Styling**: SASS & TailwindCSS

### Backend
- **Framework**: Express.js (with TypeScript)
- **Database**: MongoDB
- **ORM**: Mongoose
- **Authentication**: JSON Web Tokens (JWT)
- **File Uploads**: Multer (middleware used for handling image uploads)
- **Middleware**: Custom middleware for authentication to protect routes
- **Architecture**: MVC (Model-View-Controller)

## More about the Backend
The backend follows the **MVC (Model-View-Controller)** architecture pattern:

- **Models**: The application has models for Article, Comment, and User.
- **Controllers**: Handles the request logic. Each feature (articles, comments, users) has a separate controller that processes the request and interacts with the models.
- **Routes**: Defines the API endpoints and maps them to the appropriate controller functions.
- **Middleware**: Includes authentication middleware to ensure routes are accessed only by authenticated users.

### Key Controllers
- **Article Controller**:
  - `getAllArticles`: Fetches all articles from the database.
  - `createArticle`: Handles the creation of new articles, including file uploads.
  - `getArticleById`: Fetches a specific article by its ID.
  - `updateArticleById`: Allows the author to update the article, including replacing or deleting the featured image.
  - `deleteArticleById`: Allows the author to delete an article.

- **Comment Controller**:
  - `getCommentsByArticleId`: Fetches all comments for a given article.
  - `createComment`: Adds a new comment to an article.
  - `upvoteComment` and `downvoteComment`: Allows users to vote on comments.

- **User Controller**:
  - `loginUser`: Handles user login and returns a JWT for authenticated access.

### Authentication Middleware
- **`authMiddleware`**: Ensures that protected routes can only be accessed by authenticated users by verifying the provided JWT token.

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd blog-application-backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start the Server and Client**
   ```bash
   npm run dev
   ```

## Usage
Visit `http://localhost:5173` in your browser to use the application. Users can register, log in, and start creating, editing, and deleting articles. Comments can be added to articles, and users can vote on comments.

## API Endpoints

- **Articles**
  - `GET /api/articles` - Get all articles
  - `POST /api/articles` - Create a new article (requires authentication)
  - `PATCH /api/articles/:articleId` - Update an article (requires authentication)
  - `DELETE /api/articles/:articleId` - Delete an article (requires authentication)

- **Comments**
  - `GET /api/articles/:articleId/comments` - Get comments for an article
  - `POST /api/articles/:articleId/comments` - Add a comment to an article (requires authentication)
  - `PATCH /api/articles/:articleId/comments/:commentId/upvote` - Upvote a comment (requires authentication)
  - `PATCH /api/articles/:articleId/comments/:commentId/downvote` - Downvote a comment (requires authentication)


