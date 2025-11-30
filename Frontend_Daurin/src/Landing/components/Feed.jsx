import React from "react";
import { FiHeart, FiImage, FiMessageCircle, FiSend, FiTrash2 } from "react-icons/fi";
import Section from "./Section";

const Feed = ({
  posts,
  loadingFeed,
  currentUser,
  API_ORIGIN,
  formatDate,
  toggleLike,
  handleToggleComments,
  openComments,
  commentsByPost,
  submitComment,
  commentInputs,
  setCommentInputs,
  handleDeletePost,
}) => {
  return (
    <Section eyebrow="Timeline" title="Feed Daurin">
      {loadingFeed ? (
        <p className="text-sm text-slate-300">Memuat feed...</p>
      ) : posts.length === 0 ? (
        <p className="text-sm text-slate-400">Belum ada postingan. Jadi yang pertama!</p>
      ) : (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden shadow-inner shadow-black/30"
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-white">{post.author?.username || "Anon"}</p>
                  <p className="text-xs text-slate-400">{formatDate(post.created_at)}</p>
                </div>
                {currentUser?.id === post.user_id && (
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="text-red-300 hover:text-red-200 transition"
                    title="Hapus"
                  >
                    <FiTrash2 />
                  </button>
                )}
              </div>
              <div className="aspect-video bg-slate-800 flex items-center justify-center">
                {post.image_url ? (
                  <img
                    src={`${API_ORIGIN}${post.image_url}`}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-slate-500 flex items-center gap-2">
                    <FiImage />
                    No image
                  </div>
                )}
              </div>
              <div className="px-4 py-3 space-y-3">
                <p className="text-sm text-slate-100">{post.caption}</p>
                <div className="flex items-center gap-4 text-sm text-slate-200">
                  <button
                    onClick={() => toggleLike(post)}
                    className={`flex items-center gap-1 ${
                      post.liked_by_me ? "text-emerald-300" : "text-slate-200"
                    }`}
                  >
                    <FiHeart />
                    {post.likes_count}
                  </button>
                  <button
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1 hover:text-emerald-200"
                  >
                    <FiMessageCircle />
                    {post.comments_count} komentar
                  </button>
                </div>
                {openComments[post.id] && (
                  <div className="border-t border-slate-800 pt-3 space-y-3">
                    <div className="space-y-2 max-h-52 overflow-y-auto pr-1">
                      {(commentsByPost[post.id] || []).map((c) => (
                        <div
                          key={c.id}
                          className="text-sm bg-slate-800/60 border border-slate-800 rounded-lg px-3 py-2"
                        >
                          <p className="font-semibold text-emerald-200">{c.username || "User"}</p>
                          <p className="text-slate-100">{c.content}</p>
                          <p className="text-[11px] text-slate-400">{formatDate(c.created_at)}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Tulis komentar..."
                        className="flex-1 bg-slate-800/80 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:border-emerald-400 outline-none"
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                      />
                      <button
                        onClick={() => submitComment(post.id)}
                        className="bg-emerald-500 text-slate-900 px-3 py-2 rounded-lg hover:bg-emerald-400 transition"
                      >
                        <FiSend />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </Section>
  );
};

export default Feed;
