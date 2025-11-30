import React from "react";
import { FiArrowRight, FiImage } from "react-icons/fi";
import Section from "./Section";

const TrashDetector = ({
  detectFile,
  setDetectFile,
  detectPreview,
  setDetectPreview,
  detectResult,
  handleDetect,
  detectLoading,
}) => {
  const top = detectResult?.top || [];
  const primary = top[0];

  return (
    <Section
      eyebrow="ML"
      title="Deteksi Jenis Sampah"
      action={
        <span className="text-xs text-emerald-200 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30">
          Model ringan
        </span>
      }
    >
      <form onSubmit={handleDetect} className="space-y-3">
        <label className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-emerald-500/40 text-emerald-100 cursor-pointer bg-slate-800/60 hover:border-emerald-400/70">
          <FiImage />
          {detectFile ? detectFile.name : "Unggah foto sampah"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setDetectFile(file || null);
              setDetectPreview(file ? URL.createObjectURL(file) : "");
            }}
          />
        </label>
        {detectPreview && (
          <img src={detectPreview} alt="Preview" className="w-full rounded-lg border border-slate-800" />
        )}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2"
        >
          <FiArrowRight />
          {detectLoading ? "Memproses..." : "Deteksi"}
        </button>
      </form>
      {primary && (
        <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 text-sm space-y-2">
          <p className="text-emerald-200 font-semibold">
            Utama: {primary.label} ({Math.round(primary.confidence * 100)}%)
          </p>
          {primary.reason && <p className="text-slate-400 text-xs">Catatan: {primary.reason}</p>}
          {top.length > 1 && (
            <div className="text-slate-200 text-xs space-y-1">
              <p className="font-semibold text-emerald-200/80">Top 3 prediksi:</p>
              {top.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between">
                  <span className="capitalize">{item.label}</span>
                  <span>{Math.round(item.confidence * 100)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Section>
  );
};

export default TrashDetector;
