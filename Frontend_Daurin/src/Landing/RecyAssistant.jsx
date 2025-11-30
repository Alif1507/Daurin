import React, { useEffect, useState } from "react";
import { FiArrowLeft, FiSend, FiClock, FiGrid } from "react-icons/fi";
import { askAssistant, fetchAssistantHistory } from "../lib/api";

const Sidebar = ({ activeTab, setActiveTab }) => (
  <aside className="w-full md:w-56 z-10 bg-[#0c5c56] text-white flex md:flex-col items-center md:items-stretch py-4 md:py-8 px-4 md:px-6 gap-4 md:gap-8">
    <div className="flex items-center gap-2">
      <div className="h-10 w-10 rounded-full bg-white/10 border border-white/20" />
      <div className="text-lg font-semibold tracking-wide">DAURIN</div>
    </div>
    
    <nav className="flex md:flex-col gap-2 text-sm w-full">
      <button
        className={`flex items-center gap-3 px-3 py-2 rounded-lg font-semibold ${activeTab === "ask" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`}
        onClick={() => setActiveTab("ask")}
      >
        <FiGrid /> Ask Recy
      </button>
      <button
        className={`flex items-center gap-3 px-3 py-2 rounded-lg ${activeTab === "history" ? "bg-white/20 text-white" : "text-white/80 hover:bg-white/10"}`}
        onClick={() => setActiveTab("history")}
      >
        <FiClock /> History
      </button>
    </nav>
    <button className="mt-auto flex items-center gap-2 text-white/80 hover:text-white transition text-sm">
      <FiArrowLeft /> Kembali
    </button>
  </aside>
);

const CardOption = ({ option, onChoose }) => (
  <button
    onClick={() => onChoose(option.variant)}
    className="w-full md:w-80 text-left border border-[#0c5c56] rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition bg-white"
  >
    <p className="text-[#0c5c56] font-semibold text-sm mb-2">
      Produk {option.variant}: {option.product_name}
    </p>
    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
      {option.preview_steps?.map((s, idx) => (
        <li key={idx}>{s}</li>
      ))}
    </ul>
  </button>
);

const CardResult = ({ result }) => (
  <div className="w-full md:w-96 text-left border border-[#0c5c56] rounded-xl px-4 py-4 shadow-sm bg-white">
    <p className="text-[#0c5c56] font-semibold text-sm mb-2">
      Produk {result.variant}: {result.product_name}
    </p>
    <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
      {result.steps?.map((s, idx) => (
        <li key={idx}>{s}</li>
      ))}
    </ul>
    {result.image_url && (
      <img
        src={result.image_url}
        alt={result.product_name}
        className="mt-3 rounded-lg border border-slate-200"
      />
    )}
  </div>
);

const RecyAssistant = () => {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [needsChoice, setNeedsChoice] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ask");

  const submitPrompt = async (e) => {
    e?.preventDefault();
    if (!prompt.trim()) {
      setMessage("Isi dulu jenis sampah atau bahan daur ulang.");
      return;
    }
    setMessage("");
    setLoading(true);
    setResult(null);
    setOptions([]);
    try {
      const data = await askAssistant(prompt, "", null);
      if (data.choose_variant) {
        setOptions(data.options || []);
        setNeedsChoice(true);
      } else {
        setResult(data);
        setNeedsChoice(false);
      }
    } catch (err) {
      setMessage("Gagal meminta ide. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const chooseVariant = async (variant) => {
    setLoading(true);
    setMessage("");
    try {
      const data = await askAssistant(prompt, "", variant);
      setResult(data);
      setNeedsChoice(false);
    } catch (err) {
      setMessage("Gagal mengambil detail produk. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const loadHistory = async () => {
    try {
      const data = await fetchAssistantHistory(20);
      setHistory(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (activeTab === "history") {
      loadHistory();
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-[#e62c2c] flex items-center justify-center py-4 md:py-10 px-2 md:px-4">
      <div className="bg-white relative z-10 rounded-none md:rounded-3xl shadow-none md:shadow-2xl flex flex-col md:flex-row w-full max-w-6xl overflow-hidden min-h-[80vh]">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <img src="/img/backround.png" className="fixed top-0 left-0 w-screen h-screen" alt="" />
        <main className="flex-1 relative z-10 bg-white py-8 md:py-10 px-4 md:px-12 flex flex-col items-center">
          {activeTab === "ask" && (
            <>
              <h1 className="text-xl md:text-3xl font-semibold text-center text-black mb-6 md:mb-10">
                Hello Kenz, Mau Dibantu buat apa?
              </h1>
              <form
                onSubmit={submitPrompt}
                className="w-full max-w-3xl flex items-center gap-2 border-2 border-[#0c5c56] rounded-full px-3 md:px-4 py-2"
              >
                <input
                  type="text"
                  className="flex-1 outline-none text-sm md:text-base"
                  placeholder="Plastik botol, kardus..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                />
                <button
                  type="submit"
                  className="h-10 w-10 rounded-full bg-[#0c5c56] text-white flex items-center justify-center"
                  disabled={loading}
                >
                  <FiSend />
                </button>
              </form>
              {message && <p className="mt-4 text-sm text-red-600">{message}</p>}

              <div className="mt-8 md:mt-10 w-full flex flex-col items-center gap-6">
                {needsChoice && options.length > 0 && (
                  <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center w-full md:w-auto">
                    {options.map((opt) => (
                      <CardOption key={opt.variant} option={opt} onChoose={chooseVariant} />
                    ))}
                  </div>
                )}
                {result && !needsChoice && (
                  <div className="flex flex-col md:flex-row gap-6 justify-center w-full md:w-auto">
                    <CardResult result={result} />
                  </div>
                )}
                {loading && <p className="text-sm text-slate-500">Memproses...</p>}
              </div>
            </>
          )}

          {activeTab === "history" && (
            <div className="w-full max-w-3xl">
              <h2 className="text-xl md:text-2xl font-semibold text-center text-black mb-4 md:mb-6">History Ide Produk</h2>
              {history.length === 0 ? (
                <p className="text-sm text-slate-600 text-center">Belum ada riwayat.</p>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-3">
                  {history.map((item, idx) => (
                    <div key={idx} className="border-b last:border-b-0 border-slate-100 pb-3 last:pb-0">
                      <p className="text-xs text-slate-500">
                        {item.timestamp?.replace("T", " ").slice(0, 19)}
                      </p>
                      <p className="text-sm font-semibold text-[#0c5c56]">
                        Produk {item.variant}: {item.product_name}
                      </p>
                      <p className="text-sm text-slate-700 mb-2">Bahan: {item.trash_items}</p>
                      <ul className="list-disc list-inside text-sm text-slate-700 space-y-1">
                        {item.steps?.map((s, sidx) => (
                          <li key={sidx}>{s}</li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RecyAssistant;
