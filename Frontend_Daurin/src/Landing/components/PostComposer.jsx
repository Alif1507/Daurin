import React from "react";
import { FiCamera, FiSend } from "react-icons/fi";
import Section from "./Section";

const PostComposer = ({ postForm, setPostForm, postFeedback, submitPost }) => {
  return (
    <Section
      eyebrow="Feed"
      title="Buat Postingan"
      action={
        <span className="text-xs text-emerald-200 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30">
          Instagram-like CRUD
        </span>
      }
    >
      <form onSubmit={submitPost} className="space-y-3">
        <textarea
          placeholder="Tulis caption tentang daur ulang..."
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-emerald-400 outline-none"
          value={postForm.caption}
          onChange={(e) =>
            setPostForm((prev) => ({ ...prev, caption: e.target.value }))
          }
        />
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-emerald-500/40 text-emerald-100 cursor-pointer bg-slate-800/60 hover:border-emerald-400/70">
            <FiCamera />
            {postForm.image ? postForm.image.name : "Pilih gambar"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) =>
                setPostForm((prev) => ({
                  ...prev,
                  image: e.target.files?.[0] || null,
                }))
              }
            />
          </label>
          <button
            type="submit"
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-xl transition"
          >
            <FiSend />
            Unggah
          </button>
          {postFeedback && <span className="text-sm text-emerald-200">{postFeedback}</span>}
        </div>
      </form>
    </Section>
  );
};

export default PostComposer;
