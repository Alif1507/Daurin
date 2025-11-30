import React from "react";
import { FiSend, FiCopy } from "react-icons/fi";
import Section from "./Section";

const AssistantPanel = ({
  assistantInput,
  setAssistantInput,
  assistantResult,
  assistantOptions,
  assistantNeedsChoice,
  assistantLoading,
  assistantMessage,
  handleAssistant,
  handleAssistantVariant,
}) => {
  // Checklist progress untuk langkah-langkah
  const [completedSteps, setCompletedSteps] = React.useState([]);

  const toggleStep = (idx) => {
    setCompletedSteps((prev) =>
      prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
    );
  };

  const totalSteps = assistantResult?.steps?.length || 0;
  const completedCount = completedSteps.length;
  const progress = totalSteps ? Math.round((completedCount / totalSteps) * 100) : 0;

  const handleCopyPrompt = () => {
    if (!assistantResult?.image_prompt) return;
    if (navigator && navigator.clipboard) {
      navigator.clipboard.writeText(assistantResult.image_prompt).catch(() => {});
    }
  };

  // Reset checklist setiap kali hasil baru datang
  React.useEffect(() => {
    if (assistantResult) {
      setCompletedSteps([]);
    }
  }, [assistantResult?.product_name, assistantResult?.variant]);

  // Helper render list yang bisa string atau array
  const renderList = (data) => {
    if (!data) return null;
    if (Array.isArray(data)) {
      return (
        <ul className="list-disc list-inside space-y-1 text-slate-100/90">
          {data.map((item, idx) => (
            <li key={idx}>{item}</li>
          ))}
        </ul>
      );
    }
    return <p className="text-slate-100/90">{data}</p>;
  };

  return (
    <Section
      eyebrow="AI"
      title="Asisten Ide Produk Daur Ulang"
      action={
        <span className="text-xs text-emerald-200 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/30">
          Flow: input → Produk A/B → Resep & Preview
        </span>
      }
    >
      {/* Input form */}
      <form onSubmit={handleAssistant} className="space-y-3">
        <textarea
          placeholder="Contoh: botol plastik bekas dan kaleng alumunium..."
          className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-3 text-sm focus:border-emerald-400 outline-none"
          value={assistantInput}
          onChange={(e) => setAssistantInput(e.target.value)}
        />
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-semibold px-4 py-2 rounded-xl transition flex items-center justify-center gap-2"
        >
          <FiSend />
          {assistantLoading ? "Meminta ide..." : "Dapatkan ide"}
        </button>
        {assistantMessage && (
          <p className="text-sm text-emerald-200">{assistantMessage}</p>
        )}
      </form>

      {/* Pilih Produk A / B */}
      {assistantNeedsChoice && assistantOptions.length > 0 && (
        <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-4 space-y-3 text-sm mt-4">
          <p className="text-emerald-200 font-semibold">Pilih Produk:</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {assistantOptions.map((opt) => (
              <button
                key={opt.variant}
                type="button"
                onClick={() => {
                  setCompletedSteps([]); // reset checklist ketika ganti produk
                  handleAssistantVariant(opt.variant);
                }}
                className="text-left bg-slate-800 border border-emerald-700/50 rounded-lg px-3 py-3 hover:border-emerald-400 transition"
              >
                <p className="text-emerald-200 font-semibold">
                  Produk {opt.variant}: {opt.product_name}
                </p>
                <ul className="list-disc list-inside text-slate-300 text-xs space-y-1 mt-1">
                  {opt.preview_steps?.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Hasil Asisten */}
      {assistantResult && (
        <div className="bg-slate-800/70 border border-slate-700 rounded-lg p-4 space-y-3 text-sm mt-4">
          {/* Header produk + badge info */}
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-emerald-200 font-semibold">
              Produk {assistantResult.variant}: {assistantResult.product_name}
            </p>
            <div className="flex flex-wrap gap-2 text-xs">
              {assistantResult.difficulty && (
                <span className="px-2 py-1 rounded-full bg-slate-900/70 border border-emerald-500/40 text-emerald-200">
                  Kesulitan: {assistantResult.difficulty}
                </span>
              )}
              {assistantResult.estimated_time && (
                <span className="px-2 py-1 rounded-full bg-slate-900/70 border border-sky-500/40 text-sky-200">
                  Waktu: {assistantResult.estimated_time}
                </span>
              )}
              {assistantResult.level && (
                <span className="px-2 py-1 rounded-full bg-slate-900/70 border border-purple-500/40 text-purple-200">
                  Level: {assistantResult.level}
                </span>
              )}
            </div>
          </div>

          {/* Preview image (SVG atau apapun dari backend) */}
          {assistantResult.image_url && (
            <img
              src={assistantResult.image_url}
              alt={assistantResult.product_name}
              className="w-full rounded-lg border border-slate-800 mt-1"
            />
          )}

          {/* Layout 2 kolom: Info & langkah */}
          <div className="mt-3 grid gap-4 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1.3fr)]">
            {/* Info samping kiri: tools / bahan / tips */}
            <div className="space-y-3">
              {(assistantResult.tools || assistantResult.materials) && (
                <div className="space-y-2">
                  {assistantResult.tools && (
                    <div>
                      <p className="text-emerald-200 font-semibold text-xs uppercase tracking-wide mb-1">
                        Alat yang dibutuhkan
                      </p>
                      {renderList(assistantResult.tools)}
                    </div>
                  )}
                  {assistantResult.materials && (
                    <div>
                      <p className="text-emerald-200 font-semibold text-xs uppercase tracking-wide mb-1 mt-2">
                        Bahan utama
                      </p>
                      {renderList(assistantResult.materials)}
                    </div>
                  )}
                </div>
              )}

              {assistantResult.tips && (
                <div>
                  <p className="text-emerald-200 font-semibold text-xs uppercase tracking-wide mb-1 mt-2">
                    Tips tambahan
                  </p>
                  {renderList(assistantResult.tips)}
                </div>
              )}

              {/* Visual prompt (untuk AI image eksternal) */}
              {assistantResult.image_prompt && (
                <div className="mt-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <p className="text-emerald-200 font-semibold text-xs uppercase tracking-wide">
                      Visual prompt (opsional)
                    </p>
                    <button
                      type="button"
                      onClick={handleCopyPrompt}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[11px] bg-slate-900/80 border border-slate-600 hover:border-emerald-400 text-slate-200"
                    >
                      <FiCopy className="text-[12px]" />
                      Copy
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-300 bg-slate-900/70 border border-slate-700 rounded-md px-2 py-2 whitespace-pre-wrap">
                    {assistantResult.image_prompt}
                  </p>
                </div>
              )}
            </div>

            {/* Langkah dengan checklist + progress */}
            <div className="space-y-3">
              {totalSteps > 0 && (
                <>
                  {/* Progress bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-emerald-200 font-semibold">
                        Langkah pengerjaan
                      </span>
                      <span className="text-slate-300">
                        {completedCount}/{totalSteps} langkah ({progress}%)
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-slate-900/80 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 transition-all"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Daftar langkah */}
                  <div className="space-y-2 mt-2">
                    {assistantResult.steps?.map((step, idx) => {
                      const done = completedSteps.includes(idx);
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => toggleStep(idx)}
                          className={`w-full flex items-start gap-2 text-left rounded-lg px-2 py-2 transition border ${
                            done
                              ? "bg-emerald-500/10 border-emerald-400/60"
                              : "bg-slate-900/40 border-slate-700"
                          }`}
                        >
                          <span
                            className={`mt-1 h-5 w-5 rounded-full text-xs flex items-center justify-center border ${
                              done
                                ? "bg-emerald-500 text-slate-900 border-emerald-300"
                                : "bg-slate-900 text-emerald-200 border-emerald-400/50"
                            }`}
                          >
                            {done ? "✓" : idx + 1}
                          </span>
                          <p
                            className={`text-slate-100 text-sm ${
                              done ? "line-through decoration-emerald-400/80" : ""
                            }`}
                          >
                            {step}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </Section>
  );
};

export default AssistantPanel;
