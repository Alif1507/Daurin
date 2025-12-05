import React, { useEffect, useState } from "react";
import {
  FiArrowLeft,
  FiSend,
  FiClock,
  FiGrid,
  FiMenu,
  FiX,
} from "react-icons/fi";
import { askAssistant, fetchAssistantHistory, updateAssistantHistory } from "../lib/api";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";

const Sidebar = ({ activeTab, setActiveTab, isOpen, closeSidebar }) => (
  <>
    {/* Mobile Overlay */}
    {isOpen && (
      <div
        className="fixed inset-0 bg-black/50 z-40 md:hidden"
        onClick={closeSidebar}
      />
    )}

    {/* Sidebar */}
    <aside
      className={`
      fixed md:static inset-y-0 left-0 z-50
      w-64 md:w-56
      bg-[#0c5c56] text-white
      flex flex-col
      py-6 md:py-8 px-4 md:px-6
      gap-6 md:gap-8
      transform transition-transform duration-300 ease-in-out
      ${isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}
    `}
    >
      {/* Close button for mobile */}
      <div className="flex items-center justify-between md:hidden">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img src="/img/logo-dark.png" className="w-10 h-10" alt="" />
            <div className="text-lg font-semibold tracking-wide">DAURIN</div>
          </div>
        </Link>
        <button
          onClick={closeSidebar}
          className="p-2 hover:bg-white/10 rounded-lg"
        >
          <FiX size={24} />
        </button>
      </div>

      {/* Logo for desktop */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/">
          <div className="flex items-center gap-2">
            <img
              src="/img/logo-dark.png"
              className="w-[50px] h-[50px]"
              alt=""
            />
            <div className="text-lg font-semibold tracking-wide">DAURIN</div>
          </div>
        </Link>
      </div>

      <nav className="flex flex-col gap-2 text-sm w-full">
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition ${
            activeTab === "ask"
              ? "bg-white/20 text-white"
              : "text-white/80 hover:bg-white/10"
          }`}
          onClick={() => {
            setActiveTab("ask");
            closeSidebar();
          }}
        >
          <FiGrid size={20} /> Ask Recy
        </button>
        <button
          className={`flex items-center gap-3 px-4 py-3 rounded-lg font-semibold transition ${
            activeTab === "history"
              ? "bg-white/20 text-white"
              : "text-white/80 hover:bg-white/10"
          }`}
          onClick={() => {
            setActiveTab("history");
            closeSidebar();
          }}
        >
          <FiClock size={20} /> History
        </button>
      </nav>
    </aside>
  </>
);

const CardOption = ({ option, onChoose }) => (
  <button
    onClick={() => onChoose(option.variant)}
    className="w-full text-left border border-[#0c5c56] rounded-xl px-4 py-4 shadow-sm hover:shadow-md transition bg-white"
  >
    <p className="text-[#0c5c56] font-semibold text-sm mb-2">
      Produk {option.variant}: {option.product_name}
    </p>
    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
      {option.preview_steps?.map((s, idx) => (
        <li key={idx}>{s}</li>
      ))}
    </ul>
  </button>
);

const CardResult = ({ result }) => (
  <div className="w-full text-left border border-[#0c5c56] rounded-xl px-4 py-4 shadow-sm bg-white">
    <p className="text-[#0c5c56] font-semibold text-sm mb-2">
      Produk {result.variant}: {result.product_name}
    </p>
    <ul className="list-disc list-inside text-xs sm:text-sm text-slate-700 space-y-1">
      {result.steps?.map((s, idx) => (
        <li key={idx}>{s}</li>
      ))}
    </ul>
    {result.image_url && (
      <img
        src={result.image_url}
        alt={result.product_name}
        className="mt-3 rounded-lg border border-slate-200 w-full"
      />
    )}
  </div>
);

const HistoryCard = ({ item, onUpdated }) => {
  const { token } = useAuth();
  const [checked, setChecked] = useState(new Set(item.checked_steps || []));

  const toggle = async (idx) => {
    const next = new Set(checked);
    if (next.has(idx)) next.delete(idx);
    else next.add(idx);
    setChecked(next);
    try {
      await updateAssistantHistory(
        { timestamp: item.timestamp, checked: Array.from(next) },
        token
      );
      onUpdated?.();
    } catch (err) {
      console.error(err);
    }
  };

  const markDone = async () => {
    try {
      await updateAssistantHistory({ timestamp: item.timestamp, delete: true }, token);
      onUpdated?.();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="border-b last:border-b-0 border-slate-100 pb-3 last:pb-0">
      <div className="flex items-center justify-between">
        <p className="text-xs text-slate-500">
          {item.timestamp?.replace("T", " ").slice(0, 19)}
        </p>
        <button
          onClick={markDone}
          className="text-xs text-white bg-emerald-500 hover:bg-emerald-600 rounded-lg px-2 py-1 transition"
        >
          Done
        </button>
      </div>
      <p className="text-sm font-semibold text-[#0c5c56]">
        Produk {item.variant}: {item.product_name}
      </p>
      <p className="text-xs sm:text-sm text-slate-700 mb-2">
        Bahan: {item.trash_items}
      </p>
      <div className="flex flex-col gap-1.5">
        {item.steps?.map((s, idx) => (
          <label
            key={idx}
            className="flex items-start gap-2 text-xs sm:text-sm text-slate-700"
          >
            <input
              type="checkbox"
              checked={checked.has(idx)}
              onChange={() => toggle(idx)}
              className="accent-[#0c5c56] mt-0.5 flex-shrink-0"
            />
            <span
              className={checked.has(idx) ? "line-through text-slate-500" : ""}
            >
              {s}
            </span>
          </label>
        ))}
      </div>
    </div>
  );
};

const RecyAssistant = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState([]);
  const [needsChoice, setNeedsChoice] = useState(false);
  const [result, setResult] = useState(null);
  const [message, setMessage] = useState("");
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("ask");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

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
      const data = await askAssistant(prompt, token, null);
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
      const data = await askAssistant(prompt, token, variant);
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
      const data = await fetchAssistantHistory(20, token);
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
    <div className="min-h-screen bg-[#e62c2c] flex items-center justify-center p-0 md:py-10 md:px-4">
      <div className="bg-white relative z-10 rounded-none md:rounded-3xl shadow-none md:shadow-2xl flex flex-row w-full max-w-6xl overflow-hidden min-h-screen md:min-h-[85vh]">
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOpen={sidebarOpen}
          closeSidebar={() => setSidebarOpen(false)}
        />
        <img
          src="/img/backround.png"
          className="fixed top-0 left-0 w-screen h-screen -z-50 object-cover"
          alt=""
        />
        <main className="flex-1 relative z-10 bg-white py-6 md:py-10 px-4 md:px-8 lg:px-12 flex flex-col">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 md:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 hover:bg-slate-100 rounded-lg transition"
            >
              <FiMenu size={24} className="text-[#0c5c56]" />
            </button>
            <div className="flex items-center gap-2">
              <Link to="/">
                <div className="flex items-center gap-2">
                  <img src="/img/logo.png" className="w-10 h-10" alt="" />
                  <div className="text-lg font-semibold tracking-wide">
                    DAURIN
                  </div>
                </div>
              </Link>
            </div>
            <div className="w-10" />
          </div>

          {activeTab === "ask" && (
            <div className="flex flex-col items-center flex-1">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-center text-black mb-6 md:mb-10 px-4">
                Mau Dibantu buat apa?
              </h1>
              <div className="w-full max-w-3xl flex items-center gap-2 border-2 border-[#0c5c56] rounded-full px-3 md:px-4 py-2.5 md:py-2">
                <input
                  type="text"
                  className="flex-1 outline-none text-sm md:text-base bg-transparent"
                  placeholder="Plastik botol, kardus..."
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      submitPrompt(e);
                    }
                  }}
                />
                <button
                  onClick={submitPrompt}
                  className="h-9 w-9 md:h-10 md:w-10 rounded-full bg-[#0c5c56] text-white flex items-center justify-center flex-shrink-0 hover:bg-[#0a4a45] transition"
                  disabled={loading}
                >
                  <FiSend size={18} />
                </button>
              </div>
              {message && (
                <p className="mt-4 text-sm text-red-600 text-center px-4">
                  {message}
                </p>
              )}

              <div className="mt-8 md:mt-10 w-full flex flex-col items-center gap-4 md:gap-6 px-2">
                {needsChoice && options.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-4xl">
                    {options.map((opt) => (
                      <CardOption
                        key={opt.variant}
                        option={opt}
                        onChoose={chooseVariant}
                      />
                    ))}
                  </div>
                )}
                {result && !needsChoice && (
                  <div className="w-full max-w-2xl">
                    <CardResult result={result} />
                  </div>
                )}
                {loading && (
                  <div className="flex flex-col items-center gap-2 py-8">
                    <div className="w-8 h-8 border-3 border-[#0c5c56] border-t-transparent rounded-full animate-spin" />
                    <p className="text-sm text-slate-500">Memproses...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "history" && (
            <div className="w-full max-w-3xl mx-auto">
              <h2 className="text-xl md:text-2xl font-semibold text-center text-black mb-4 md:mb-6">
                History Ide Produk
              </h2>
              {history.length === 0 ? (
                <p className="text-sm text-slate-600 text-center">
                  Belum ada riwayat.
                </p>
              ) : (
                <div className="bg-white border border-slate-200 rounded-xl p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-200px)] md:max-h-[calc(85vh-200px)]">
                  {history.map((item, idx) => (
                    <HistoryCard
                      key={idx}
                      item={item}
                      onUpdated={() => loadHistory()}
                    />
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
