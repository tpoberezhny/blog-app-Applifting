Applifting Blog Tymofii Poberezhnyi

Overview:

This project is a full-featured blog application where users can create, edit, delete, and comment (vote up/down) on articles. The app provides a predefined user with credentials, supporting features such as image uploads and markdown formatting for article content (implemented only for Create Article).

Technologies Used For Back & Front - End:
FrontEnd: React & TypeScript.
State-management: Redux-RTK.
HTTP requests: Axios.
Styling: Sass & TailwindCSS.
~
BackEnd: Express.js & TypeScript.
Database: MongoDB.
ORM: Mongoose.
Authentication: JWT.
File Uploads: Multer - Middleware used for handling image uploads.
Middleware: Custom middleware for authentication to protect routes.
Architecture: The backend follows the MVC (Model-View-Controller).

More about BackEnd:
The project follows the MVC (Model-View-Controller) architecture pattern:
Models: The application has models for Article, Comment, and User.
Controllers: Handles the request logic. For each feature (articles, comments, users), there is a separate controller that processes the request and interacts with the models.
Routes: Defines the API endpoints and maps them to the appropriate controller functions.
Middleware: Includes the authentication middleware that ensures routes are accessed only by authenticated users.

Key Controllers
Article Controller:
getAllArticles: Fetches all articles from the database.
createArticle: Handles the creation of new articles, including file uploads.
getArticleById: Fetches a specific article by its ID.
updateArticleById: Allows the author to update the article, including replacing or deleting the featured image.
deleteArticleById: Allows the author to delete an article.

Comment Controller:
getCommentsByArticleId: Fetches all comments for a given article.
createComment: Adds a new comment to an article.
upvoteComment and downvoteComment: Allows users to vote on comments.

User Controller:
loginUser: Handles user login and returns a JWT for authenticated access.

Authentication Middleware:
authMiddleware: Ensures that protected routes can only be accessed by authenticated users by verifying the provided JWT token.

Installation:
1. Clone the repository:
git clone <repository-url>
cd blog-application-backend

2. Install dependencies:
npm install

3. Start the server and client
npm run dev

API Endpoints

GET /api/articles - Get all articles

POST /api/articles - Create a new article (requires authentication)

PATCH /api/articles/:articleId - Update an article (requires authentication)

DELETE /api/articles/:articleId - Delete an article (requires authentication)

GET /api/articles/:articleId/comments - Get comments for an article

POST /api/articles/:articleId/comments - Add a comment to an article (requires authentication)

PATCH /api/articles/:articleId/comments/:commentId/upvote - Upvote a comment (requires authentication)

PATCH /api/articles/:articleId/comments/:commentId/downvote - Downvote a comment (requires authentication)