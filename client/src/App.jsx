import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Dashboard from "./pages/Dashboard";
import AdminLayout from "./components/AdminLayout";
import PrivateRoute from "./components/PrivateRoute";
import OnlyAdminPrivateRoute from "./components/OnlyAdminPrivateRoute";
import CreatePost from "./pages/CreatePost";
import UpdatePost from "./pages/UpdatePost";
import ArticlePreview from "./pages/ArticlePreview";
import PostPage from "./pages/PostPage";
import ScrollToTop from "./components/ScrollToTop";
import Search from "./pages/Search";
import CategoryPage from "./pages/CategoryPage";

function AppContent() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<SignIn />}></Route>
        <Route path="/sign-up" element={<SignUp />}></Route>
        <Route path="/search" element={<Search />}></Route>
        {/*ADMIN ONLY LINKS */}
        <Route element={<PrivateRoute />}>
          {" "}
          <Route element={<AdminLayout />}>
            <Route path="/dashboard" element={<Dashboard />}></Route>
            <Route path="/post/:postSlug" element={<PostPage />}></Route>
            <Route element={<OnlyAdminPrivateRoute />}>
              {" "}
              <Route path="/create-post" element={<CreatePost />}></Route>
              <Route path="/update-post/:postId" element={<UpdatePost />}></Route>
              <Route path="/article-preview" element={<ArticlePreview />}></Route>
              <Route path="/category" element={<CategoryPage />}></Route>
            </Route>
          </Route>
        </Route>
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
