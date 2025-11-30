import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";

import {
  API_ORIGIN,
  addComment,
  askAssistant,
  createPost,
  deletePost,
  detectTrash,
  fetchProfileApi,
  likePost,
  listComments,
  listPosts,
  loginUser,
  registerUser,
  unlikePost,
} from "./lib/api";
import AuthSection from "./Landing/components/AuthSection";
import PostComposer from "./Landing/components/PostComposer";
import Feed from "./Landing/components/Feed";
import TrashDetector from "./Landing/components/TrashDetector";
import AssistantPanel from "./Landing/components/AssistantPanel";
import IdentifikasiSampah from "./Landing/IdentifikasiSampah";

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const App = () => {
  const [authMode, setAuthMode] = useState("login");
  const [authForm, setAuthForm] = useState({
    email: "",
    username: "",
    password: "",
  });
  const [token, setToken] = useState(localStorage.getItem("token") || "");
  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });
  const [authMessage, setAuthMessage] = useState("");

  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ caption: "", image: null });
  const [postFeedback, setPostFeedback] = useState("");
  const [loadingFeed, setLoadingFeed] = useState(false);

  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [openComments, setOpenComments] = useState({});

  const [detectFile, setDetectFile] = useState(null);
  const [detectResult, setDetectResult] = useState(null);
  const [detectPreview, setDetectPreview] = useState("");
  const [detectLoading, setDetectLoading] = useState(false);

  const [assistantInput, setAssistantInput] = useState("");
  const [assistantResult, setAssistantResult] = useState(null);
  const [assistantLoading, setAssistantLoading] = useState(false);
  const [assistantMessage, setAssistantMessage] = useState("");
  const [assistantOptions, setAssistantOptions] = useState([]);
  const [assistantNeedsChoice, setAssistantNeedsChoice] = useState(false);

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const data = await fetchProfileApi(token);
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    setLoadingFeed(true);
    try {
      const data = await listPosts(token);
      setPosts(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingFeed(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [token]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    try {
      await registerUser(authForm);
      setAuthMode("login");
      setAuthMessage("Akun dibuat. Silakan login.");
    } catch (err) {
      setAuthMessage(err.message);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthMessage("");
    try {
      const data = await loginUser(authForm.email, authForm.password);
      setToken(data.token);
      localStorage.setItem("token", data.token);
      setCurrentUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      setAuthMessage("Login berhasil");
    } catch (err) {
      setAuthMessage(err.message);
    }
  };

  const handleLogout = () => {
    setToken("");
    setCurrentUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  const submitPost = async (e) => {
    e.preventDefault();
    if (!token) {
      setPostFeedback("Login dulu untuk membuat postingan.");
      return;
    }
    if (!postForm.image) {
      setPostFeedback("Pilih gambar dulu.");
      return;
    }
    setPostFeedback("");
    try {
      const data = await createPost(postForm.caption, postForm.image, token);
      setPosts((prev) => [data, ...prev]);
      setPostForm({ caption: "", image: null });
    } catch (err) {
      setPostFeedback(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!token) return;
    await deletePost(postId, token);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const toggleLike = async (post) => {
    if (!token) {
      setPostFeedback("Login untuk menyukai postingan.");
      return;
    }
    const liked = post.liked_by_me;
    if (liked) {
      await unlikePost(post.id, token);
    } else {
      await likePost(post.id, token);
    }
    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked_by_me: !liked,
              likes_count: p.likes_count + (liked ? -1 : 1),
            }
          : p
      )
    );
  };

  const loadComments = async (postId) => {
    const data = await listComments(postId);
    setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
  };

  const handleToggleComments = (postId) => {
    setOpenComments((prev) => ({ ...prev, [postId]: !prev[postId] }));
    if (!commentsByPost[postId]) {
      loadComments(postId);
    }
  };

  const submitComment = async (postId) => {
    if (!token) {
      setPostFeedback("Login untuk berkomentar.");
      return;
    }
    const content = commentInputs[postId] || "";
    if (!content.trim()) return;
    const data = await addComment(postId, content, token);
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [...(prev[postId] || []), data],
    }));
    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
    setPosts((prev) =>
      prev.map((p) =>
        p.id === postId ? { ...p, comments_count: p.comments_count + 1 } : p
      )
    );
  };

  const handleDetect = async (e) => {
    e.preventDefault();
    if (!detectFile) return;
    setDetectLoading(true);
    setDetectResult(null);
    try {
      const data = await detectTrash(detectFile);
      setDetectResult(data);
    } catch (err) {
      setDetectResult({ trash_type: "unknown" });
    } finally {
      setDetectLoading(false);
    }
  };

  const handleAssistant = async (e) => {
    e.preventDefault();
    setAssistantMessage("");
    if (!assistantInput.trim()) {
      setAssistantMessage("Tulis jenis sampahmu.");
      return;
    }
    setAssistantLoading(true);
    try {
      const data = await askAssistant(assistantInput, token);
      if (data.choose_variant) {
        setAssistantOptions(data.options || []);
        setAssistantNeedsChoice(true);
        setAssistantResult(null);
        setAssistantMessage("Pilih Produk A atau B di bawah.");
      } else {
        setAssistantResult(data);
        setAssistantNeedsChoice(false);
        setAssistantOptions([]);
      }
    } catch (err) {
      setAssistantMessage("Gagal memanggil asisten.");
    } finally {
      setAssistantLoading(false);
    }
  };

  const handleAssistantVariant = async (variant) => {
    if (!assistantInput.trim()) {
      setAssistantMessage("Tulis jenis sampahmu dulu.");
      return;
    }
    setAssistantLoading(true);
    setAssistantMessage("");
    try {
      const data = await askAssistant(assistantInput, token, variant);
      setAssistantResult(data);
      setAssistantNeedsChoice(false);
      setAssistantOptions([]);
    } catch (err) {
      setAssistantMessage("Gagal memanggil asisten.");
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
        <IdentifikasiSampah
           detectFile={detectFile}
              setDetectFile={setDetectFile}
              detectPreview={detectPreview}
              setDetectPreview={setDetectPreview}
              detectResult={detectResult}
              handleDetect={handleDetect}
              detectLoading={detectLoading}
        />
        <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-emerald-300/80">
              Daurin Social Lab
            </p>
            <h1 className="text-2xl md:text-3xl font-semibold mt-1">
              Eco-feed + ML Deteksi Sampah + Asisten Ide Daur Ulang
            </h1>
            <p className="text-slate-300 mt-1">
              Buat, sukai, dan komentari postingan; klasifikasikan sampah; dan
              dapatkan ide produk dari bahan bekas.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-emerald-500/10 border border-emerald-500/40 px-3 py-2 rounded-xl">
            {currentUser ? (
              <>
                <div className="h-10 w-10 rounded-full bg-emerald-400/20 border border-emerald-400/40 flex items-center justify-center font-semibold">
                  {currentUser.username?.slice(0, 2)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-sm text-emerald-200">Hi, {currentUser.username}</p>
                  <p className="text-xs text-slate-300">{currentUser.email}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="ml-2 inline-flex items-center gap-2 text-sm text-emerald-200 hover:text-white transition"
                >
                  <FiLogOut />
                  Keluar
                </button>
              </>
            ) : (
              <p className="text-sm text-emerald-100">
                Masuk untuk memposting, menyukai, dan memakai asisten.
              </p>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <AuthSection
              authMode={authMode}
              setAuthMode={setAuthMode}
              authForm={authForm}
              setAuthForm={setAuthForm}
              authMessage={authMessage}
              handleLogin={handleLogin}
              handleRegister={handleRegister}
            />

            <PostComposer
              postForm={postForm}
              setPostForm={setPostForm}
              postFeedback={postFeedback}
              submitPost={submitPost}
            />

            <Feed
              posts={posts}
              loadingFeed={loadingFeed}
              currentUser={currentUser}
              API_ORIGIN={API_ORIGIN}
              formatDate={formatDate}
              toggleLike={toggleLike}
              handleToggleComments={handleToggleComments}
              openComments={openComments}
              commentsByPost={commentsByPost}
              submitComment={submitComment}
              commentInputs={commentInputs}
              setCommentInputs={setCommentInputs}
              handleDeletePost={handleDeletePost}
            />
          </div>

          <div className="space-y-5">
            <TrashDetector
              detectFile={detectFile}
              setDetectFile={setDetectFile}
              detectPreview={detectPreview}
              setDetectPreview={setDetectPreview}
              detectResult={detectResult}
              handleDetect={handleDetect}
              detectLoading={detectLoading}
            />

            <AssistantPanel
              assistantInput={assistantInput}
              setAssistantInput={setAssistantInput}
              assistantResult={assistantResult}
              assistantOptions={assistantOptions}
              assistantNeedsChoice={assistantNeedsChoice}
              assistantLoading={assistantLoading}
              assistantMessage={assistantMessage}
              handleAssistant={handleAssistant}
              handleAssistantVariant={handleAssistantVariant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
