import React, { useEffect, useState } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiTrash2,
  FiSend,
  FiHome,
  FiUser,
  FiLogOut,
  FiMenu,
  FiX,
  FiGrid,
} from "react-icons/fi";
import {
  API_ORIGIN,
  addComment,
  createPost,
  deletePost,
  likePost,
  listComments,
  listPosts,
  unlikePost,
  updateProfile,
  fetchFollowStats,
  followUser,
  unfollowUser,
} from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "";

const Dashboard = () => {
  const { user, token, logout, fetchMe } = useAuth();
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [postForm, setPostForm] = useState({ caption: "", image: null });
  const [postError, setPostError] = useState("");
  const [commentsByPost, setCommentsByPost] = useState({});
  const [commentInputs, setCommentInputs] = useState({});
  const [profileForm, setProfileForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [profileMsg, setProfileMsg] = useState("");
  const [activeTab, setActiveTab] = useState("public");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalPost, setModalPost] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [followStats, setFollowStats] = useState(null);
  const [followCache, setFollowCache] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (!token || !user) {
      navigate("/login");
    } else {
      setProfileForm({
        username: user.username,
        email: user.email,
        password: "",
      });
      fetchFeed(selectedUser, 1);
      if (selectedUser) fetchFollow(selectedUser);
    }
  }, [token, user, selectedUser]);

  const fetchFeed = async (userId = null, pageNum = 1) => {
    try {
      const data = await listPosts(token, userId, pageNum, 6);
      setPosts(data.items || []);
      setPage(data.page || 1);
      setTotalPages(data.pages || 1);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollow = async (userId) => {
    try {
      const stats = await fetchFollowStats(userId, token);
      setFollowStats(stats);
      setFollowCache((prev) => ({ ...prev, [userId]: stats }));
    } catch (err) {
      setFollowStats(null);
    }
  };

  useEffect(() => {
    if (activeTab === "feed" && selectedUser) {
      fetchFollow(selectedUser);
    }
  }, [activeTab, selectedUser]);

  const submitPost = async (e) => {
    // biar bisa dipanggil dari onClick biasa
    if (e) e.preventDefault();

    setPostError("");

    if (!user || !token) {
      setPostError("Silakan login terlebih dahulu.");
      return;
    }
    if (!postForm.image) {
      setPostError("Pilih gambar terlebih dahulu.");
      return;
    }

    try {
      const data = await createPost(postForm.caption, postForm.image, token);
      setPosts((prev) => [data, ...prev]);
      setPostForm({ caption: "", image: null });
      setShowCreateModal(false);
    } catch (err) {
      console.error(err);
      setPostError(err.message || "Gagal mengunggah postingan");
    }
  };

  const handleDeletePost = async (postId) => {
    await deletePost(postId, token);
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  const toggleLike = async (post) => {
    if (post.liked_by_me) await unlikePost(post.id, token);
    else await likePost(post.id, token);

    setPosts((prev) =>
      prev.map((p) =>
        p.id === post.id
          ? {
              ...p,
              liked_by_me: !post.liked_by_me,
              likes_count: p.likes_count + (post.liked_by_me ? -1 : 1),
            }
          : p
      )
    );
  };

  const loadComments = async (postId) => {
    const data = await listComments(postId);
    setCommentsByPost((prev) => ({ ...prev, [postId]: data }));
  };

  const openModal = (post) => {
    setModalPost(post);
    loadComments(post.id);
  };

  const submitComment = async (postId) => {
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
        p.id === postId
          ? { ...p, comments_count: p.comments_count + 1 }
          : p
      )
    );
  };

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileMsg("");
    try {
      await updateProfile(
        {
          username: profileForm.username,
          email: profileForm.email,
          password: profileForm.password || undefined,
        },
        token
      );
      setProfileMsg("Profil diperbarui.");
      fetchMe(token);
      setProfileForm((p) => ({ ...p, password: "" }));
    } catch (err) {
      setProfileMsg(err.message || "Gagal update profil");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex">
      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-white border-r border-emerald-200 transform transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="h-full flex flex-col">
          <Link to="/">
          <div className="p-6 border-b border-emerald-200 gap-2 flex items-center ">
            <img src="/img/logo.png" className="w-[50px] h-[50px]" alt="" />
            <h1 className="text-2xl font-bold text-[#005048]">Daurin</h1>
          </div>
          </Link>

          <nav className="flex-1 p-4 space-y-2">
            <button
              onClick={() => {
                setActiveTab("public");
                setSelectedUser(null);
                setSidebarOpen(false);
                fetchFeed(null, 1);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === "public"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              <FiGrid size={20} />
              <span className="font-medium">Public Feed</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("feed");
                setSelectedUser(user?.id || null);
                setSidebarOpen(false);
                fetchFeed(user?.id || null, 1);
                if (user?.id) fetchFollow(user.id);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === "feed"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              <FiHome size={20} />
              <span className="font-medium">Feed</span>
            </button>
            <button
              onClick={() => {
                setActiveTab("profile");
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                activeTab === "profile"
                  ? "bg-emerald-100 text-emerald-700"
                  : "text-slate-600 hover:bg-emerald-50"
              }`}
            >
              <FiUser size={20} />
              <span className="font-medium">Profil</span>
            </button>
          </nav>

          <div className="p-4 border-t border-emerald-200">
            <div className="flex items-center gap-3 mb-4 bg-emerald-50 border border-emerald-200 px-3 py-3 rounded-xl">
              <div className="h-10 w-10 rounded-full bg-emerald-200 border border-emerald-300 flex items-center justify-center font-semibold text-emerald-700">
                {user.username?.slice(0, 2)?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-emerald-700 truncate">
                  {user.username}
                </p>
                <p className="text-xs text-slate-600 truncate">{user.email}</p>
              </div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/");
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm text-slate-600 hover:bg-red-50 hover:text-red-600 rounded-xl transition"
            >
              <FiLogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-emerald-200 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-emerald-50 rounded-lg transition"
          >
            {sidebarOpen ? (
              <FiX size={24} className="text-slate-700" />
            ) : (
              <FiMenu size={24} className="text-slate-700" />
            )}
          </button>
          <h1 className="text-xl font-bold text-emerald-600">Daurin</h1>
          <div className="w-10" />
        </div>

        <div className="max-w-5xl mx-auto px-4 py-6 space-y-6">
          {(activeTab === "feed" || activeTab === "public") && (
            <>
              <section className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800">
                      Feed
                    </h2>
                    {activeTab === "feed" && selectedUser && followStats && (
                      <p className="text-sm text-slate-600 mt-1">
                        Followers:{" "}
                        <span className="font-semibold">
                          {followStats.followers_count}
                        </span>{" "}
                        · Following:{" "}
                        <span className="font-semibold">
                          {followStats.following_count}
                        </span>
                      </p>
                    )}
                  </div>
                  {selectedUser === user?.id && (
                    <button
                      onClick={() => setShowCreateModal(true)}
                      className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-2 rounded-xl transition shadow-sm"
                    >
                      Buat Postingan
                    </button>
                  )}
                </div>
              </section>

              <section
                className={`${
                  activeTab === "public"
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                    : "space-y-4"
                }`}
              >
                {posts.length === 0 ? (
                  <div className="bg-white border border-emerald-200 rounded-2xl p-8 text-center shadow-sm col-span-full">
                    <p className="text-slate-500">Belum ada postingan.</p>
                  </div>
                ) : (
                  posts.map((post) => (
                    <article
                      key={post.id}
                      className="bg-white rounded-2xl border border-emerald-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col"
                    >
                      <div className="flex items-center justify-between px-5 py-4">
                        <div>
                          <button
                            onClick={() => {
                              setSelectedUser(post.user_id);
                              setActiveTab("feed");
                              fetchFeed(post.user_id, 1);
                              fetchFollow(post.user_id);
                            }}
                            className="text-sm font-semibold text-emerald-700 hover:underline"
                          >
                            {post.author?.username || "Anon"}
                          </button>
                          <p className="text-xs text-slate-500">
                            {formatDate(post.created_at)}
                          </p>
                        </div>
                        <div className="text-right text-xs text-slate-600">
                          Followers:{" "}
                          {followCache[post.user_id]?.followers_count ?? "-"}
                        </div>
                        {user?.id === post.user_id && (
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="text-red-400 hover:text-red-600 transition p-2 hover:bg-red-50 rounded-lg"
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
                        )}
                      </div>

                      <button
                        onClick={() => openModal(post)}
                        className="w-full"
                      >
                        <div className="aspect-video bg-emerald-50 flex items-center justify-center">
                          {post.image_url ? (
                            <img
                              src={`${API_ORIGIN}${post.image_url}`}
                              alt={post.caption}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="text-slate-400">No image</div>
                          )}
                        </div>
                      </button>

                      <div className="px-5 py-4 space-y-3">
                        <p className="text-sm text-slate-700">
                          {post.caption}
                        </p>
                        <div className="flex items-center gap-4 text-sm">
                          <button
                            onClick={() => toggleLike(post)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition ${
                              post.liked_by_me
                                ? "text-emerald-600 bg-emerald-50"
                                : "text-slate-600 hover:bg-slate-50"
                            }`}
                          >
                            <FiHeart
                              className={
                                post.liked_by_me ? "fill-current" : ""
                              }
                            />
                            {post.likes_count}
                          </button>
                          <button
                            onClick={() => openModal(post)}
                            className="flex items-center gap-1.5 text-slate-600 hover:bg-slate-50 px-3 py-1.5 rounded-lg transition"
                          >
                            <FiMessageCircle />
                            {post.comments_count} komentar
                          </button>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </section>

              <div className="flex items-center justify-center gap-3 mt-4">
                <button
                  className="px-3 py-1 rounded-lg border border-emerald-200 text-sm disabled:opacity-50"
                  disabled={page <= 1}
                  onClick={() => fetchFeed(selectedUser, page - 1)}
                >
                  Prev
                </button>
                <span className="text-sm text-slate-600">
                  Page {page} / {totalPages}
                </span>
                <button
                  className="px-3 py-1 rounded-lg border border-emerald-200 text-sm disabled:opacity-50"
                  disabled={page >= totalPages}
                  onClick={() => fetchFeed(selectedUser, page + 1)}
                >
                  Next
                </button>
              </div>
            </>
          )}

          {activeTab === "profile" && (
            <section className="bg-white border border-emerald-200 rounded-2xl p-6 shadow-sm max-w-xl">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-semibold text-slate-800">
                  Profil
                </h2>
              </div>
              <div className="mb-4 text-sm text-slate-700 flex gap-6">
                <div>
                  Followers:{" "}
                  <span className="font-semibold">
                    {followStats?.followers_count ?? "-"}
                  </span>
                </div>
                <div>
                  Following:{" "}
                  <span className="font-semibold">
                    {followStats?.following_count ?? "-"}
                  </span>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Username
                  </label>
                  <input
                    className="bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                    value={profileForm.username}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        username: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    type="email"
                    className="bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                    value={profileForm.email}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        email: e.target.value,
                      }))
                    }
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-sm font-medium text-slate-700">
                    Password baru (opsional)
                  </label>
                  <input
                    type="password"
                    className="bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                    value={profileForm.password}
                    onChange={(e) =>
                      setProfileForm((p) => ({
                        ...p,
                        password: e.target.value,
                      }))
                    }
                  />
                </div>
                <button
                  onClick={handleProfileSave}
                  className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-4 py-3 rounded-xl transition shadow-sm"
                >
                  Simpan Perubahan
                </button>
                {profileMsg && (
                  <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3">
                    <p className="text-sm text-emerald-700">{profileMsg}</p>
                  </div>
                )}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* DETAIL POST MODAL */}
      {modalPost && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => setModalPost(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-3xl w-full overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-5 py-3 border-b border-emerald-100">
              <button
                onClick={() => {
                  setSelectedUser(modalPost.user_id);
                  setActiveTab("feed");
                  setModalPost(null);
                }}
                className="text-sm font-semibold text-emerald-700 hover:underline"
              >
                {modalPost.author?.username || "User"}
              </button>
              <p className="text-xs text-slate-500">
                {formatDate(modalPost.created_at)}
              </p>
            </div>
            <div className="aspect-video bg-emerald-50 flex items-center justify-center">
              {modalPost.image_url ? (
                <img
                  src={`${API_ORIGIN}${modalPost.image_url}`}
                  alt={modalPost.caption}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-slate-400">No image</div>
              )}
            </div>
            <div className="px-5 py-4 space-y-3">
              <p className="text-sm text-slate-700">{modalPost.caption}</p>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1.5 text-slate-600">
                  <FiHeart />
                  {modalPost.likes_count} likes
                </span>
                <span className="flex items-center gap-1.5 text-slate-600">
                  <FiMessageCircle />
                  {modalPost.comments_count} komentar
                </span>
              </div>

              {followStats && modalPost.user_id !== user?.id && (
                <button
                  onClick={() => {
                    const action = followStats.is_following
                      ? unfollowUser
                      : followUser;
                    action(modalPost.user_id, token).then(() =>
                      fetchFollow(modalPost.user_id)
                    );
                  }}
                  className="text-sm text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg px-3 py-1 transition"
                >
                  {followStats.is_following ? "Unfollow" : "Follow"}
                </button>
              )}

              <div className="border-t border-emerald-100 pt-3 space-y-3 max-h-64 overflow-y-auto">
                {(commentsByPost[modalPost.id] || []).map((c) => (
                  <div
                    key={c.id}
                    className="text-sm bg-emerald-50/50 border border-emerald-100 rounded-xl px-4 py-3"
                  >
                    <p className="font-semibold text-emerald-700">
                      {c.username || "User"}
                    </p>
                    <p className="text-slate-700 mt-1">{c.content}</p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      {formatDate(c.created_at)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-emerald-100">
                <input
                  type="text"
                  placeholder="Tulis komentar..."
                  className="flex-1 bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
                  value={commentInputs[modalPost.id] || ""}
                  onChange={(e) =>
                    setCommentInputs((prev) => ({
                      ...prev,
                      [modalPost.id]: e.target.value,
                    }))
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      submitComment(modalPost.id);
                    }
                  }}
                />
                <button
                  onClick={() => submitComment(modalPost.id)}
                  className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl hover:bg-emerald-600 transition shadow-sm"
                >
                  <FiSend />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE POST MODAL */}
      {showCreateModal && (
        <div
          className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4"
          onClick={() => setShowCreateModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-5 space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">
                Buat Postingan
              </h3>
              <button onClick={() => setShowCreateModal(false)}>
                <FiX className="text-slate-600" />
              </button>
            </div>

            <textarea
              className="w-full bg-emerald-50/50 border border-emerald-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-500 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-200 outline-none"
              placeholder="Tuliskan caption..."
              rows={3}
              value={postForm.caption}
              onChange={(e) =>
                setPostForm((p) => ({ ...p, caption: e.target.value }))
              }
            />

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setPostForm((p) => ({
                  ...p,
                  image: e.target.files?.[0] || null,
                }))
              }
              className="text-sm text-slate-600"
              required
            />

            {postError && (
              <p className="text-sm text-red-600">{postError}</p>
            )}

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={submitPost}
                className="px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition"
              >
                Upload
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
