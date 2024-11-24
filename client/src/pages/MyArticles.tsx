import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchArticles } from "../redux/slices/fetchArticles";
import { deleteArticle } from "../redux/slices/deleteArticle";
import { RootState, AppDispatch } from "../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { FaEdit, FaTrash } from "react-icons/fa";

const MyArticles: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articles, loading, error } = useSelector((state: RootState) => state.articles);
  const { user } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    dispatch(fetchArticles());
  }, [dispatch]);

  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      dispatch(deleteArticle(id));
    }
  };

  const truncateContent = (content: string, maxLength: number = 100): string => {
    return content.length > maxLength ? `${content.substring(0, maxLength)}...` : content;
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const userArticles = articles.filter(article => article.author.name === user?.name);

  return (
    <div className="px-10 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My articles</h1>
        <Link to="/create-article" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200">
          Create new article
        </Link>
      </div>
      <table className="min-w-full bg-white border">
        <thead>
          <tr className="border-b">
            <th className="myArticlesTitles">Article title</th>
            <th className="myArticlesTitles">Perex</th>
            <th className="myArticlesTitles">Author</th>
            <th className="myArticlesTitles"># of comments</th>
            <th className="myArticlesTitles">Actions</th>
          </tr>
        </thead>
        <tbody>
          {userArticles.map((article) => (
            <tr key={article._id} className="border-b hover:bg-gray-100 transition">
              <td className="myArticlesValues">{article.title}</td>
              <td className="myArticlesValues">{truncateContent(article.content, 100)}</td>
              <td className="myArticlesValues">{article.author.name}</td>
              <td className="myArticlesValues">{article.commentsCount}</td>
              <td className="myArticlesValues flex space-x-4">
                <button
                  onClick={() => navigate(`/edit-article/${article._id}`)}
                  className="text-blue-600 hover:text-blue-800 transition"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(article._id)}
                  className="text-red-600 hover:text-red-800 transition"
                >
                  <FaTrash />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyArticles;
