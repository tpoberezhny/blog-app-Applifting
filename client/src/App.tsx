import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import NavBar from './components/NavBar';
import Login from './pages/Login';
import RecentArticles from './pages/RecentArticles';
import ArticleDetail from './pages/ArticleDetail';
import CreateArticle from './pages/CreateArticle';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <NavBar />
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<RecentArticles />} />
            <Route path="/login" element={<Login />} />
            <Route path="/articles/:id" element={<ArticleDetail />} />
            <Route path="/create-article" element={<CreateArticle />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
