import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { fetchArticleById } from "../redux/slices/fetchArticles";
import { updateArticle } from "../redux/slices/updateArticle";
import { RootState, AppDispatch } from "../redux/store";

const EditArticle: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { articleDetail, loading, error } = useSelector(
    (state: RootState) => state.articles
  );

  const [title, setTitle] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);
  const [deleteImage, setDeleteImage] = useState<boolean>(false);

  useEffect(() => {
    if (id) {
      dispatch(fetchArticleById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (articleDetail) {
      setTitle(articleDetail.title);
      setContent(articleDetail.content);
    }
  }, [articleDetail]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
      setDeleteImage(false);
    }
  };

  const handleDeleteImage = () => {
    setImage(null);
    setDeleteImage(true);
  };

  const handleSubmit = async () => {
    if (!title || !content) {
      alert("Title and content are required.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    } else if (deleteImage) {
      formData.append("deleteImage", "true");
    }

    await dispatch(updateArticle({ id: id!, formData }));
    navigate("/my-articles");
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-left">
      <h1 className="text-3xl font-bold mb-6">Edit article</h1>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">
          Article Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded"
        />
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">
          Featured Image
        </label>
        <div className="mb-2">
          {articleDetail?.imageUrl && !deleteImage && (
            <div className="mb-4">
              <img
                src={articleDetail.imageUrl}
                alt={title}
                className="w-48 h-32 object-cover rounded mb-2"
              />
              <button
                onClick={handleDeleteImage}
                className="text-red-600 hover:text-red-800"
              >
                Delete Image
              </button>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-lg font-semibold mb-2">Content</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="w-full h-60 p-2 border border-gray-300 rounded"
          placeholder="Does not Support markdown here. But easy to implement!"
        />
      {/*Does not implement markdown here for saving time*/}
      </div>
      <button
        onClick={handleSubmit}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
      >
        Save changes
      </button>
    </div>
  );
};

export default EditArticle;
