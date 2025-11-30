import { useState } from "react";

// ================== DATA DASAR ==================

const BUILDINGS = {
  road: {
    key: "road",
    name: "Road",
    cost: 5,
    pollution: 2,
    happiness: -1,
    economy: 1,
    colorClass: "bg-slate-400",
    description: "Jalan dasar. Sedikit polusi tapi penting untuk ekonomi.",
  },
  park: {
    key: "park",
    name: "Park",
    cost: 15,
    pollution: -5,
    happiness: 8,
    economy: 0,
    colorClass: "bg-emerald-400",
    description: "Taman kota hijau, bikin warga bahagia dan udara bersih.",
  },
  solar: {
    key: "solar",
    name: "Solar Panel",
    cost: 20,
    pollution: -7,
    happiness: 4,
    economy: 3,
    colorClass: "bg-sky-400",
    description: "Energi bersih, kurangi polusi dan dukung ekonomi.",
  },
  factory: {
    key: "factory",
    name: "Factory",
    cost: 25,
    pollution: 10,
    happiness: -5,
    economy: 10,
    colorClass: "bg-orange-400",
    description: "Pabrik menambah ekonomi, tapi polusi naik.",
  },
  bus: {
    key: "bus",
    name: "Bus Station",
    cost: 18,
    pollution: -3,
    happiness: 3,
    economy: 4,
    colorClass: "bg-indigo-400",
    description: "Transport publik, ngurangin kendaraan pribadi.",
  },
  recycle: {
    key: "recycle",
    name: "Recycle Center",
    cost: 22,
    pollution: -8,
    happiness: 2,
    economy: 2,
    colorClass: "bg-teal-400",
    description: "Pusat daur ulang, bantu turunkan polusi jangka panjang.",
  },
};

const LEVELS = [
  {
    id: "standard",
    name: "Kota Normal",
    description: "Kota biasa dengan polusi sedang. Ubah jadi eco-city hijau.",
    initialStats: { pollution: 60, happiness: 40, economy: 40 },
    startingMoney: 100,
    introMessage: "Kotamu masih abu-abu. Ubah jadi kota hijau! 🌱",
  },
  {
    id: "industrial",
    name: "Kota Industri",
    description: "Banyak pabrik, polusi tinggi, ekonomi kuat tapi warga lelah.",
    initialStats: { pollution: 80, happiness: 30, economy: 60 },
    startingMoney: 120,
    introMessage:
      "Kota industri penuh asap. Bisakah kamu bikin ekonominya tetap jalan sambil nurunin polusi? 🏭",
  },
  {
    id: "coastal",
    name: "Kota Pesisir",
    description:
      "Kota tepi laut dengan risiko banjir dan kenaikan permukaan air.",
    initialStats: { pollution: 55, happiness: 45, economy: 35 },
    startingMoney: 110,
    introMessage:
      "Kota pesisir rentan banjir. Jaga lingkungan biar warga tetap aman. 🌊",
  },
];

const EVENTS = [
  {
    key: "flood",
    name: "Banjir Besar",
    description:
      "Curah hujan tinggi dan drainase buruk memicu banjir. Warga terdampak.",
    effect: { pollution: 5, happiness: -10, economy: -8 },
    weight: 1.2,
    levels: ["coastal"],
  },
  {
    key: "heatwave",
    name: "Gelombang Panas",
    description:
      "Suhu kota naik drastis. Area tanpa ruang hijau terasa menyiksa.",
    effect: { pollution: 3, happiness: -8, economy: -4 },
    weight: 1,
  },
  {
    key: "protest",
    name: "Demo Warga",
    description:
      "Warga protes kebijakan tidak pro-lingkungan. Pemerintah tertekan.",
    effect: { pollution: 0, happiness: -12, economy: -5 },
    weight: 1,
  },
  {
    key: "greenSubsidy",
    name: "Subsidi Hijau",
    description:
      "Pemerintah pusat memberi subsidi untuk proyek energi terbarukan.",
    effect: { pollution: -8, happiness: 6, economy: 5 },
    weight: 1,
  },
  {
    key: "cleanup",
    name: "Gerakan Bersih Kota",
    description:
      "Gerakan komunitas membersihkan sungai dan taman kota secara massal.",
    effect: { pollution: -6, happiness: 7, economy: 0 },
    weight: 1,
  },
];

function clamp(num, min, max) {
  return Math.min(Math.max(num, min), max);
}

// ================== KOMPONEN UTAMA ==================

export default function Game() {
  // Level
  const [levelIndex, setLevelIndex] = useState(0);
  const currentLevel = LEVELS[levelIndex];

  // State game
  const [grid, setGrid] = useState(Array(25).fill(null)); // 5x5
  const [selectedBuilding, setSelectedBuilding] = useState(null);
  const [stats, setStats] = useState(currentLevel.initialStats);
  const [money, setMoney] = useState(currentLevel.startingMoney);
  const [turn, setTurn] = useState(0);
  const [statusMessage, setStatusMessage] = useState(
    currentLevel.introMessage
  );
  const [gameOver, setGameOver] = useState(false);

  // Event
  const [activeEvent, setActiveEvent] = useState(null);
  const [eventLog, setEventLog] = useState([]);

  // ================== LOGIKA BANTU ==================

  const getCityStatusLabel = (s) => {
    const { pollution, happiness, economy } = s;
    if (pollution <= 20 && happiness >= 70 && economy >= 50) {
      return "🌿 Eco City – Kota hijau sejahtera!";
    }
    if (pollution >= 80) return "☠️ Kota beracun – polusi parah!";
    if (happiness <= 20) return "😟 Warga resah – kebijakan kurang ramah.";
    if (economy <= 15) return "📉 Krisis ekonomi – kota bangkrut.";
    if (pollution <= 40 && happiness >= 50) {
      return "💚 Kota mulai hijau, terus perbaiki!";
    }
    return "🌫 Kota masih abu-abu, butuh lebih banyak solusi hijau.";
  };

  const winCondition = (s) =>
    s.pollution <= 20 && s.happiness >= 70 && s.economy >= 50;

  const loseCondition = (s) =>
    s.pollution >= 90 || s.happiness <= 10 || s.economy <= 0;

  const checkGameEnd = (newStats) => {
    if (winCondition(newStats)) {
      setStatusMessage(
        "Selamat! Kamu berhasil mengubah kota ini menjadi Eco City hijau! 🌱"
      );
      setGameOver(true);
      return;
    }

    if (loseCondition(newStats)) {
      setStatusMessage(
        "Kota kolaps! Kebijakanmu tidak berkelanjutan. Coba lagi dan lebih seimbang. 💥"
      );
      setGameOver(true);
      return;
    }

    setStatusMessage(getCityStatusLabel(newStats));
  };

  // Random event setiap turn (tidak selalu muncul)
  const triggerRandomEvent = (baseStats) => {
    // Chance event muncul (misal 40%)
    const roll = Math.random();
    if (roll > 0.4) {
      setActiveEvent(null);
      return baseStats;
    }

    // Filter event sesuai level (kalau ada field levels)
    const applicableEvents = EVENTS.filter((ev) => {
      if (!ev.levels) return true;
      return ev.levels.includes(currentLevel.id);
    });

    if (applicableEvents.length === 0) {
      setActiveEvent(null);
      return baseStats;
    }

    // Random pick dengan weight sederhana
    const pool = [];
    applicableEvents.forEach((ev) => {
      const count = ev.weight ? Math.round(ev.weight * 10) : 10;
      for (let i = 0; i < count; i++) pool.push(ev);
    });
    const event =
      pool[Math.floor(Math.random() * pool.length)] || applicableEvents[0];

    const newStats = {
      pollution: clamp(baseStats.pollution + event.effect.pollution, 0, 100),
      happiness: clamp(baseStats.happiness + event.effect.happiness, 0, 100),
      economy: clamp(baseStats.economy + event.effect.economy, 0, 100),
    };

    setActiveEvent({
      ...event,
      effectApplied: event.effect,
    });

    setEventLog((prev) => [
      {
        turn: turn + 1,
        name: event.name,
        description: event.description,
        effect: event.effect,
      },
      ...prev.slice(0, 9), // keep last 10
    ]);

    return newStats;
  };

  // ================== HANDLER ==================

  const handleSelectBuilding = (key) => {
    if (gameOver) return;
    setSelectedBuilding(key);
  };

  const handlePlaceBuilding = (index) => {
    if (gameOver) return;
    if (!selectedBuilding) return;

    if (grid[index] !== null) {
      // sudah ada bangunan
      return;
    }

    const building = BUILDINGS[selectedBuilding];
    if (!building) return;

    if (money < building.cost) {
      alert("Uangmu tidak cukup buat bangunan ini, bro 💸");
      return;
    }

    const newGrid = [...grid];
    newGrid[index] = building.key;
    setGrid(newGrid);

    const newMoney = money - building.cost;
    setMoney(newMoney);

    let updatedStats = {
      pollution: clamp(stats.pollution + building.pollution, 0, 100),
      happiness: clamp(stats.happiness + building.happiness, 0, 100),
      economy: clamp(stats.economy + building.economy, 0, 100),
    };

    // Trigger event (kalau kena)
    updatedStats = triggerRandomEvent(updatedStats);

    setStats(updatedStats);

    const newTurn = turn + 1;
    setTurn(newTurn);

    checkGameEnd(updatedStats);
  };

  const handleReset = () => {
    setGrid(Array(25).fill(null));
    setSelectedBuilding(null);
    setStats(currentLevel.initialStats);
    setMoney(currentLevel.startingMoney);
    setTurn(0);
    setStatusMessage(currentLevel.introMessage);
    setGameOver(false);
    setActiveEvent(null);
    setEventLog([]);
  };

  const handleChangeLevel = (idx) => {
    setLevelIndex(idx);
    // Reset game setiap ganti level
    const lvl = LEVELS[idx];
    setGrid(Array(25).fill(null));
    setSelectedBuilding(null);
    setStats(lvl.initialStats);
    setMoney(lvl.startingMoney);
    setTurn(0);
    setStatusMessage(lvl.introMessage);
    setGameOver(false);
    setActiveEvent(null);
    setEventLog([]);
  };

  // ================== UI KOMBINATOR ==================

  const renderStatBar = (label, value, emoji, barColor = "bg-emerald-400") => {
    return (
      <div className="mb-2">
        <div className="flex items-center justify-between text-xs mb-1">
          <span>
            {emoji} {label}
          </span>
          <span>{value}</span>
        </div>
        <div className="w-full h-2 rounded-full bg-slate-600/70 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-200`}
            style={{ width: `${value}%` }}
          ></div>
        </div>
      </div>
    );
  };

  // ================== RENDER ==================

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-emerald-900 text-white flex justify-center px-4 py-4">
      <div className="flex flex-col md:flex-row gap-4 max-w-5xl w-full">
        {/* PANEL KIRI */}
        <div className="w-full md:w-72 bg-slate-900/85 border border-slate-600/60 rounded-2xl p-4 shadow-lg shadow-emerald-500/10 backdrop-blur">
          {/* Header + level selector */}
          <div className="flex items-start justify-between gap-2 mb-3">
            <div>
              <h1 className="text-lg font-bold tracking-tight">
                Green City Tycoon
              </h1>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Dari kota abu-abu menuju kota hijau berkelanjutan. 🌱
              </p>
            </div>
          </div>

          <div className="mb-3">
            <label className="text-xs text-slate-300 mb-1 block">
              🎯 Pilih Skenario Kota
            </label>
            <div className="flex gap-1.5 flex-wrap">
              {LEVELS.map((lvl, idx) => (
                <button
                  key={lvl.id}
                  onClick={() => handleChangeLevel(idx)}
                  className={`text-[11px] px-2.5 py-1 rounded-full border transition-all ${
                    levelIndex === idx
                      ? "bg-emerald-500/90 border-emerald-400 text-slate-900 shadow-md shadow-emerald-400/40"
                      : "bg-slate-800/80 border-slate-600 hover:border-emerald-400/80 hover:bg-slate-800"
                  }`}
                >
                  {lvl.name}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-300 mt-1">
              {currentLevel.description}
            </p>
          </div>

          {/* Money & turn */}
          <div className="flex items-center justify-between text-xs mb-2">
            <span>💰 Money: {money}</span>
            <span>🕒 Turn: {turn}</span>
          </div>

          {/* Stats */}
          <div className="mb-3">
            {renderStatBar("Pollution", stats.pollution, "💨", "bg-red-400")}
            {renderStatBar("Happiness", stats.happiness, "😊", "bg-yellow-300")}
            {renderStatBar("Economy", stats.economy, "💼", "bg-sky-400")}
          </div>

          {/* Status message */}
          <p className="text-[11px] text-slate-100 mb-3 min-h-[40px]">
            {statusMessage}
          </p>

          <div className="border-t border-slate-700/80 my-2" />

          {/* Bangunan */}
          <h2 className="text-xs font-semibold mb-2 uppercase tracking-wide text-slate-200">
            Bangunan
          </h2>
          <div className="grid grid-cols-1 gap-2 mb-3">
            {Object.values(BUILDINGS).map((b) => (
              <button
                key={b.key}
                onClick={() => handleSelectBuilding(b.key)}
                disabled={gameOver}
                className={`text-left px-2.5 py-2 rounded-xl border text-xs transition-all group ${
                  selectedBuilding === b.key
                    ? "border-emerald-400 bg-emerald-500/10 shadow-md shadow-emerald-400/30"
                    : "border-slate-600/70 bg-slate-900/95 hover:border-emerald-400/80 hover:bg-slate-800/90"
                } ${gameOver ? "opacity-60 cursor-not-allowed" : "cursor-pointer"}`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="font-medium">{b.name}</span>
                  <span className="text-[11px]">💰 {b.cost}</span>
                </div>
                <p className="text-[10px] text-slate-300 mb-1">
                  {b.description}
                </p>
                <div className="text-[10px] text-slate-200 flex gap-2">
                  <span>♻ P: {b.pollution}</span>
                  <span>😀: {b.happiness}</span>
                  <span>💼: {b.economy}</span>
                </div>
              </button>
            ))}
          </div>

          <button
            onClick={handleReset}
            className="w-full py-2 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500 via-emerald-400 to-emerald-500 text-slate-900 shadow-md shadow-emerald-400/40 hover:brightness-110 active:scale-[0.98] transition-all"
          >
            Reset Game
          </button>
        </div>

        {/* PANEL KANAN */}
        <div className="flex-1 bg-slate-900/85 border border-slate-600/60 rounded-2xl p-4 shadow-lg shadow-emerald-500/10 backdrop-blur flex flex-col">
          <div className="flex items-start justify-between mb-3 gap-2">
            <div>
              <h2 className="text-sm md:text-base font-semibold">
                Peta Kota ({currentLevel.name})
              </h2>
              <p className="text-[11px] text-slate-300 mt-0.5">
                Pilih bangunan di panel kiri, lalu klik kotak di peta untuk
                menaruhnya.
              </p>
            </div>
            <div className="hidden md:flex flex-col items-end text-[11px] text-slate-300">
              <span>Status Kota:</span>
              <span className="text-right text-emerald-300">
                {getCityStatusLabel(stats)}
              </span>
            </div>
          </div>

          {/* GRID KOTA */}
          <div className="grid grid-cols-5 gap-2 flex-1">
            {grid.map((cell, idx) => {
              const building = cell ? BUILDINGS[cell] : null;
              return (
                <button
                  key={idx}
                  onClick={() => handlePlaceBuilding(idx)}
                  className={`rounded-xl border text-[11px] flex items-center justify-center text-center px-1 py-1.5 transition-all ${
                    building
                      ? `${building.colorClass} text-slate-900 border-slate-200/60 shadow-sm shadow-emerald-300/50`
                      : "bg-slate-900/90 text-slate-500 border-slate-600/80 hover:border-emerald-400/70 hover:bg-slate-800/90"
                  } ${
                    gameOver || building
                      ? "cursor-default"
                      : "cursor-pointer active:scale-[0.97]"
                  }`}
                >
                  {building ? building.name : "Empty"}
                </button>
              );
            })}
          </div>

          {/* Status & Event */}
          <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px]">
            <div className="rounded-xl bg-slate-950/70 border border-slate-700/80 p-2">
              <p className="font-semibold mb-1">Status Kota</p>
              <p className="text-slate-200">{getCityStatusLabel(stats)}</p>
            </div>

            <div className="rounded-xl bg-slate-950/70 border border-slate-700/80 p-2">
              <p className="font-semibold mb-1">Event Terakhir</p>
              {activeEvent ? (
                <div className="space-y-1">
                  <p className="text-emerald-300 font-medium">
                    {activeEvent.name}
                  </p>
                  <p className="text-slate-200">{activeEvent.description}</p>
                  <p className="text-[10px] text-slate-300">
                    Efek: 💨 {activeEvent.effectApplied.pollution} | 😀{" "}
                    {activeEvent.effectApplied.happiness} | 💼{" "}
                    {activeEvent.effectApplied.economy}
                  </p>
                </div>
              ) : (
                <p className="text-slate-300">
                  Belum ada event khusus di turn ini.
                </p>
              )}
            </div>
          </div>

          {/* LOG EVENT (opsional, kecil di bawah) */}
          {eventLog.length > 0 && (
            <div className="mt-3 rounded-xl bg-slate-950/60 border border-slate-800/90 p-2 max-h-32 overflow-y-auto text-[10px]">
              <p className="font-semibold mb-1">Riwayat Event</p>
              <ul className="space-y-0.5">
                {eventLog.map((ev, idx) => (
                  <li key={idx} className="text-slate-300">
                    <span className="text-emerald-300 mr-1">Turn {ev.turn}:</span>
                    <span className="font-medium">{ev.name}</span>{" "}
                    <span className="text-slate-400">
                      (💨 {ev.effect.pollution} | 😀 {ev.effect.happiness} | 💼{" "}
                      {ev.effect.economy})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
