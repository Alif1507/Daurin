import React, { useEffect, useState } from "react";
import { FiLogOut } from "react-icons/fi";
import AuthSection from "./components/AuthSection";
import PostComposer from "./components/PostComposer";
import Feed from "./components/Feed";
import TrashDetector from "./components/TrashDetector";
import AssistantPanel from "./components/AssistantPanel";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000/api";
const API_ORIGIN = (() => {
  try {
    const url = new URL(API_BASE);
    return `${url.protocol}//${url.host}`;
  } catch (err) {
    return "http://localhost:5000";
  }
})();

const formatDate = (value) => {
  if (!value) return "";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
};

const SocialLab = () => {
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

  const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

  const fetchProfile = async () => {
    if (!token) return;
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        headers: { ...authHeader },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setCurrentUser(data);
      localStorage.setItem("user", JSON.stringify(data));
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async () => {
    setLoadingFeed(true);
    try {
      const res = await fetch(`${API_BASE}/posts/`, {
        headers: { ...authHeader },
      });
      const data = await res.json();
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
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(authForm),
      });
      if (!res.ok) {
        throw new Error("Pendaftaran gagal");
      }
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
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: authForm.email,
          password: authForm.password,
        }),
      });
      if (!res.ok) throw new Error("Email atau password salah");
      const data = await res.json();
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
    const formData = new FormData();
    formData.append("caption", postForm.caption);
    formData.append("image", postForm.image);
    try {
      const res = await fetch(`${API_BASE}/posts/`, {
        method: "POST",
        headers: { ...authHeader },
        body: formData,
      });
      if (!res.ok) throw new Error("Gagal mengunggah");
      const data = await res.json();
      setPosts((prev) => [data, ...prev]);
      setPostForm({ caption: "", image: null });
    } catch (err) {
      setPostFeedback(err.message);
    }
  };

  const handleDeletePost = async (postId) => {
    if (!token) return;
    await fetch(`${API_BASE}/posts/${postId}`, {
      method: "DELETE",
      headers: { ...authHeader },
    });
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const toggleLike = async (post) => {
    if (!token) {
      setPostFeedback("Login untuk menyukai postingan.");
      return;
    }
    const liked = post.liked_by_me;
    const endpoint = `${API_BASE}/likes/`;
    const method = liked ? "DELETE" : "POST";
    const body = JSON.stringify({ post_id: post.id });
    await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json", ...authHeader },
      body,
    });
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
    const res = await fetch(`${API_BASE}/comments/${postId}`);
    const data = await res.json();
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
    const res = await fetch(`${API_BASE}/comments/`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ post_id: postId, content }),
    });
    const data = await res.json();
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
    const formData = new FormData();
    formData.append("image", detectFile);
    try {
      const res = await fetch(`${API_BASE}/ml/detect-trash`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
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
    if (!token) {
      setAssistantMessage("Login dulu untuk memakai asisten.");
      return;
    }
    if (!assistantInput.trim()) {
      setAssistantMessage("Tulis jenis sampahmu.");
      return;
    }
    setAssistantLoading(true);
    try {
      const res = await fetch(`${API_BASE}/assistant/suggest`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...authHeader },
        body: JSON.stringify({ trash_items: assistantInput }),
      });
      const data = await res.json();
      setAssistantResult(data);
    } catch (err) {
      setAssistantMessage("Gagal memanggil asisten.");
    } finally {
      setAssistantLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-950 text-white">
      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">
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
              assistantLoading={assistantLoading}
              assistantMessage={assistantMessage}
              handleAssistant={handleAssistant}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SocialLab;
