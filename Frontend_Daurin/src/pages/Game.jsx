import { useEffect, useRef, useState } from "react";

const LANES = 3;
const TRACK_LENGTH = 6;
const PLAYER_ROW_INDEX = TRACK_LENGTH - 2; // place player slightly above the bottom visually

const TRASH_TYPES = {
  organik: {
    key: "organik",
    label: "Sampah Organik",
    emoji: "/img/game/oraganik.png",
    color: "bg-emerald-500",
  },
  anorganik: {
    key: "anorganik",
    label: "Sampah Anorganik",
    emoji: "/img/game/anorganik.png",
    color: "bg-sky-400",
  },
  b3: {
    key: "b3",
    label: "Sampah B3",
    emoji: "/img/game/b3.png",
    color: "bg-amber-300",
  },
};

function createEmptyRow() {
  return Array(LANES).fill(null);
}

function createInitialTrack() {
  return Array(TRACK_LENGTH)
    .fill(null)
    .map(() => createEmptyRow());
}

function generateRow() {
  const row = createEmptyRow();
  // 60% chance ada sampah
  if (Math.random() < 0.6) {
    const laneIndex = Math.floor(Math.random() * LANES);
    const types = Object.keys(TRASH_TYPES);
    const picked = types[Math.floor(Math.random() * types.length)];
    row[laneIndex] = { type: picked };
  }
  return row;
}

export default function App() {
  const [game, setGame] = useState({
    track: createInitialTrack(),
    playerLane: 1, // 0,1,2
    score: 0,
    mistakes: 0,
    lives: 3,
    steps: 0,
    counts: { organik: 0, anorganik: 0, b3: 0 },
    pendingTrash: null, // { type }
    gameOver: false,
    win: false,
    message: "Tekan Mulai untuk berlari dan pilah sampah!",
  });

  const [isRunning, setIsRunning] = useState(false);
  const [showStart, setShowStart] = useState(true);
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [timeLeft, setTimeLeft] = useState(60);
  const touchStartX = useRef(null);
  const runningRef = useRef(false);
  const gameOverRef = useRef(false);

  // ====== GAME LOOP (AUTO JALAN) ======
  useEffect(() => {
    if (!isRunning || game.gameOver || game.pendingTrash) return;

    const interval = setInterval(() => {
      setGame((prev) => {
        if (prev.gameOver || prev.pendingTrash) return prev;

        const newTrack = [...prev.track];
        // geser ke bawah: row baru di atas, row paling bawah hilang
        newTrack.pop();
        newTrack.unshift(generateRow());

        // cek tabrakan sampah di posisi player (baris player)
        const playerRow = [...newTrack[PLAYER_ROW_INDEX]];
        const cell = playerRow[prev.playerLane];

        let newPending = prev.pendingTrash;
        let newMessage = prev.message;

        if (!newPending && cell) {
          // player kena sampah: stop dulu, suruh pilah
          newPending = cell;
          playerRow[prev.playerLane] = null;
          newTrack[PLAYER_ROW_INDEX] = playerRow;
          newMessage =
            "Ada sampah di depanmu! Pilih tempat sampah yang tepat! ♻️";
        }

        const newSteps = prev.steps + 1;

        return {
          ...prev,
          track: newTrack,
          pendingTrash: newPending,
          steps: newSteps,
          message: newMessage,
        };
      });
    }, 800);

    return () => clearInterval(interval);
  }, [isRunning, game.gameOver, game.pendingTrash]);

  // TIMER COUNTDOWN
  useEffect(() => {
    if (!isRunning || game.gameOver) return;
    if (timeLeft <= 0) {
      setGame((prev) => ({
        ...prev,
        gameOver: true,
        win: true,
        message: "Waktu habis! Kamu membersihkan area tepat waktu. 🎉",
      }));
      setIsRunning(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isRunning, game.gameOver, timeLeft]);

  // Prevent page scroll while on game screen
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // ====== CONTROL: GERAK KIRI / KANAN ======
  const moveLeft = () => {
    setGame((prev) => {
      if (gameOverRef.current || !runningRef.current) return prev;
      const newLane = Math.max(0, prev.playerLane - 1);
      return { ...prev, playerLane: newLane };
    });
  };

  const moveRight = () => {
    setGame((prev) => {
      if (gameOverRef.current || !runningRef.current) return prev;
      const newLane = Math.min(LANES - 1, prev.playerLane + 1);
      return { ...prev, playerLane: newLane };
    });
  };

  // ====== CONTROL: PILAH SAMPAH ======
  const handleSort = (choiceKey) => {
    setGame((prev) => {
      if (!prev.pendingTrash || prev.gameOver) return prev;

      const correct = prev.pendingTrash.type === choiceKey;
      let newScore = prev.score;
      let newMistakes = prev.mistakes;
      let newLives = prev.lives;
      let newMessage = "";
      const newCounts = { ...prev.counts };

      if (correct) {
        newScore += 1;
        newCounts[choiceKey] = (newCounts[choiceKey] || 0) + 1;
        newMessage = "Nice! Kamu memilah sampah dengan benar! 🌱";
      } else {
        newMistakes += 1;
        newLives -= 1;
        newMessage = "Ups, salah tempat sampah. Hati-hati lagi ya. 😅";
      }

      let gameOver = prev.gameOver;
      let win = prev.win;

      if (newLives <= 0) {
        gameOver = true;
        newMessage =
          "Nyawa habis! Kota masih kotor... coba lagi dan pilah lebih baik. 💀";
      } else if (newScore >= 30) {
        gameOver = true;
        win = true;
        newMessage =
          "Keren! Kamu sudah memilah banyak sampah dan kota jadi jauh lebih bersih! 🏆";
      }

      return {
        ...prev,
        score: newScore,
        mistakes: newMistakes,
        lives: newLives,
        counts: newCounts,
        pendingTrash: null,
        gameOver,
        win,
        message: newMessage,
      };
    });
  };

  // ====== KEYBOARD CONTROL (← → dan 1 2 3) ======
  useEffect(() => {
    runningRef.current = isRunning;
  }, [isRunning]);

  useEffect(() => {
    gameOverRef.current = game.gameOver;
  }, [game.gameOver]);

  // ====== KEYBOARD CONTROL (← → dan 1 2 3) ======
  useEffect(() => {
    const handleKey = (e) => {
      if (!runningRef.current || gameOverRef.current) return;
      if (e.key === "ArrowLeft" || e.key === "a") {
        moveLeft();
      } else if (e.key === "ArrowRight" || e.key === "d") {
        moveRight();
      } else if (e.key === "1") {
        handleSort("organik");
      } else if (e.key === "2") {
        handleSort("anorganik");
      } else if (e.key === "3") {
        handleSort("b3");
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleSort]);

  const toggleRun = () => {
    if (game.gameOver) return;
    setIsRunning((prev) => !prev);
    if (!isRunning && !game.pendingTrash) {
      setGame((prev) => ({
        ...prev,
        message: "Lari! Hindari dan pilah sampah di jalanan kota! 🏃‍♂️",
      }));
      setShowStart(false);
    }
  };

  const startGame = () => {
    const seconds = Math.min(Math.max(selectedMinutes, 1), 7) * 60;
    setTimeLeft(seconds);
    setShowStart(false);
    setIsRunning(true);
    setGame((prev) => ({
      ...prev,
      message: "Lari! Hindari dan pilah sampah di jalanan kota! 🏃‍♂️",
    }));
  };

  const resetGame = () => {
    setGame({
      track: createInitialTrack(),
      playerLane: 1,
      score: 0,
      mistakes: 0,
      lives: 3,
      steps: 0,
      counts: { organik: 0, anorganik: 0, b3: 0 },
      pendingTrash: null,
      gameOver: false,
      win: false,
      message: "Tekan Mulai untuk berlari dan pilah sampah!",
    });
    setTimeLeft(Math.min(Math.max(selectedMinutes, 1), 7) * 60);
    setIsRunning(false);
    setShowStart(true);
  };

  const timeText = `${String(Math.floor(timeLeft / 60)).padStart(2, "0")}:${String(
    timeLeft % 60
  ).padStart(2, "0")}`;
  const counts = game.counts || { organik: 0, anorganik: 0, b3: 0 };

  return (
    <div className="h-screen bg-gradient-to-b from-cyan-200 via-white to-cyan-100 flex items-center justify-center px-2 sm:px-3 md:px-6 py-3 md:py-6 overflow-hidden">
      
      <div className="relative w-full max-w-6xl bg-transparent rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.15)]">
        {/* Background side panels */}
       
        <div className="absolute inset-0 flex">
          <div className="w-[18%] bg-emerald-700/90">
          </div>
          <div className="flex-1 bg-transparent" />
          <div className="w-[18%] bg-emerald-700/90" />
        </div>

        <div className="relative grid md:grid-cols-[18%_1fr_18%] min-h-[80vh]">
          {/* Left rail */}
          <div className="hidden md:flex flex-col items-center py-6 text-white gap-4">
            <button
              onClick={toggleRun}
              disabled={game.gameOver}
              className="h-12 w-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center text-lg font-bold shadow-lg backdrop-blur"
            >
              {isRunning ? "II" : "▶"}
            </button>
          </div>

          {/* Center board */}
          <div className="relative flex flex-col items-center justify-center py-4 md:py-6 px-2 md:px-3">
            <div className="w-full max-w-3xl">
              <div className="text-center text-slate-800 mb-4">
                <h1 className="text-2xl md:text-3xl font-semibold">
                  Pilah Sampah Cepat
                </h1>
                <p className="text-sm text-slate-600">
                  Gerakkan karakter dan pilih kategori yang tepat
                </p>
              </div>

              <div
                className="relative mx-auto w-full max-w-[640px] md:max-w-[720px] aspect-[9/16] md:aspect-[10/16] max-h-[82vh] md:max-h-[86vh] rounded-[28px] overflow-hidden shadow-2xl border border-slate-200/80 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 touch-none"
                onTouchStart={(e) => {
                  touchStartX.current = e.changedTouches[0].clientX;
                }}
                onTouchEnd={(e) => {
                  const endX = e.changedTouches[0].clientX;
                  const startX = touchStartX.current;
                  if (startX === null) return;
                  const delta = endX - startX;
                  if (Math.abs(delta) > 30) {
                    if (delta > 0) {
                      moveRight();
                    } else {
                      moveLeft();
                    }
                  }
                  touchStartX.current = null;
                }}
              >
                {/* faint background */}
                <div className="absolute inset-y-0 left-[10%] w-[80%] bg-gradient-to-b from-slate-800/30 via-slate-900/80 to-black/90 rounded-[28px]" />

                {/* dashed lanes */}
                <div className="absolute inset-y-0 left-1/3 w-px border-l border-dashed border-white/70 opacity-70" />
                <div className="absolute inset-y-0 left-2/3 w-px border-l border-dashed border-white/70 opacity-70" />
                
               

                {/* Mobile move buttons */}
                <div className="absolute z-500 inset-x-0 bottom-40 flex justify-between px-4 md:hidden pointer-events-none">
                  <button
                    onClick={moveLeft}
                    className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 border border-white/30 text-white text-xl font-semibold shadow-lg backdrop-blur"
                  >
                    ‹
                  </button>
                  <button
                    onClick={moveRight}
                    className="pointer-events-auto h-12 w-12 rounded-full bg-white/20 border border-white/30 text-white text-xl font-semibold shadow-lg backdrop-blur"
                  >
                    ›
                  </button>
                </div>

                {/* Player + trash */}
                <div className="relative h-full grid grid-rows-6 pb-20 md:pb-16">
                  {game.track.map((row, rowIndex) => (
                    <div key={rowIndex} className="grid grid-cols-3 h-full">
                      {row.map((cell, laneIndex) => {
                        const isPlayerRow = rowIndex === PLAYER_ROW_INDEX;
                        const isPlayerLane = laneIndex === game.playerLane;
                        const isPlayerHere = isPlayerRow && isPlayerLane;
                        const trash = cell ? TRASH_TYPES[cell.type] : null;
                        return (
                          <div
                            key={laneIndex}
                            className="relative flex items-center justify-center"
                          >
                            {trash && (
                              <img
                                src={trash.emoji}
                                alt={trash.label}
                                className={`w-10 h-10 object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.35)] transition-all ${
                                  rowIndex < 2
                                    ? "scale-75 opacity-80"
                                    : rowIndex < 4
                                    ? "scale-90 opacity-90"
                                    : "scale-100"
                                }`}
                              />
                            )}
                            {isPlayerHere && (
                              <div className="absolute bottom-16 md:bottom-12 text-5xl drop-shadow-[0_10px_20px_rgba(0,0,0,0.45)]">
                                <img src="/img/game/player.png" className="w- h-25" alt="player" />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>

                {/* Bottom choices */}
                <div className="absolute bottom-3 inset-x-4 grid grid-cols-3 gap-3">
                  {Object.values(TRASH_TYPES).map((t, idx) => (
                    <button
                      key={t.key}
                      onClick={() => handleSort(t.key)}
                      className="bg-white rounded-2xl shadow-lg border border-slate-200 py-3 px-2 flex flex-col items-center gap-1 hover:-translate-y-0.5 transition"
                    >
                      <img src={t.emoji} alt={t.label} className="w-10 h-10 object-contain" />
                      <span className="text-xs text-slate-800 text-center leading-tight">
                        {t.label}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {idx + 1}
                      </span>
                    </button>
                  ))}
                </div>

                {/* Start overlay */}
                {showStart && !game.gameOver && (
                  <div className="absolute rounded-3xl inset-0 z-501 bg-white/75 backdrop-blur-sm flex flex-col items-center justify-center gap-5 px-6">
                    <button
                      onClick={startGame}
                      className="px-7 py-3 rounded-full bg-emerald-700 text-white text-lg font-semibold shadow-lg hover:translate-y-[-1px] transition"
                    >
                      MULAI
                    </button>
                    <p className="text-sm md:text-base text-slate-800 text-center">
                      Tujuan: kumpulkan 30 sampah dan identifikasi jenisnya!
                    </p>
                    <div className="flex items-center gap-4 text-sm md:text-base text-slate-800">
                      <button
                        onClick={() => setSelectedMinutes((m) => Math.max(1, m - 1))}
                        className="px-2 py-1 rounded-full hover:bg-slate-200 transition"
                      >
                        &lt;
                      </button>
                      <span className="min-w-[80px] text-center">{selectedMinutes} menit</span>
                      <button
                        onClick={() => setSelectedMinutes((m) => Math.min(7, m + 1))}
                        className="px-2 py-1 rounded-full hover:bg-slate-200 transition"
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                )}

                {/* Game over overlay */}
                {game.gameOver && (
                  <div className="absolute inset-0 bg-white/70 backdrop-blur-sm flex items-center justify-center px-4">
                    <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl p-6 md:p-8 text-center space-y-4">
                      <p className="text-lg md:text-xl font-semibold text-slate-900">
                        Yeyy!! Kamu berhasil mengumpulkan sampah sebanyak
                      </p>
                      <div className="grid grid-cols-3 gap-4 md:gap-6 text-slate-800">
                        <div className="flex flex-col items-center gap-1">
                          <img src={TRASH_TYPES.organik.emoji} alt="organik" className="w-14 h-14 object-contain" />
                          <span className="text-sm font-semibold">{counts.organik}x</span>
                          <span className="text-xs text-slate-600">Sampah Organik</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <img src={TRASH_TYPES.anorganik.emoji} alt="anorganik" className="w-14 h-14 object-contain" />
                          <span className="text-sm font-semibold">{counts.anorganik}x</span>
                          <span className="text-xs text-slate-600">Sampah Anorganik</span>
                        </div>
                        <div className="flex flex-col items-center gap-1">
                          <img src={TRASH_TYPES.b3.emoji} alt="b3" className="w-14 h-14 object-contain" />
                          <span className="text-sm font-semibold">{counts.b3}x</span>
                          <span className="text-xs text-slate-600">Sampah B3</span>
                        </div>
                      </div>
                      <div className="flex justify-center gap-3 md:gap-4">
                        <button
                          onClick={resetGame}
                          className="px-5 py-2 rounded-full bg-emerald-700 text-white font-semibold shadow hover:translate-y-[-1px] transition"
                        >
                          Ulang
                        </button>
                        <button
                          onClick={() => {
                            resetGame();
                            setShowStart(true);
                          }}
                          className="px-5 py-2 rounded-full bg-emerald-700 text-white font-semibold shadow hover:translate-y-[-1px] transition"
                        >
                          Kembali
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-3 text-center text-sm text-slate-700">
                {game.message}
              </div>
            </div>
          </div>

          {/* Right rail */}
          <div className="hidden md:flex flex-col justify-between py-6 text-white items-center">
            <div className="flex flex-col items-center gap-3">
              <div className="flex items-center gap-2 text-lg font-semibold">
                <span className="text-rose-400">❤️</span>
                <span>
                  {game.lives}/3
                </span>
              </div>
              <div className="text-sm font-medium">{timeText}</div>
            </div>

            <div className="text-xs text-center bg-white/10 border border-white/30 rounded-xl px-3 py-2 backdrop-blur">
              <p>Score: {game.score}</p>
              <p>Langkah: {game.steps}</p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                onClick={resetGame}
                className="px-4 py-2 rounded-full bg-white/20 border border-white/40 text-sm font-semibold"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
