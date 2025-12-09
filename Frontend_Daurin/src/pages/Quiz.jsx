import { useState, useRef, useEffect } from 'react';
import { FaArrowLeft } from "react-icons/fa";
import { Link } from 'react-router';

export default function Quiz() {
  const [activeQuestion, setActiveQuestion] = useState(null);
  const [answeredQuestions, setAnsweredQuestions] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [showAlreadyAnswered, setShowAlreadyAnswered] = useState(false);
  const [showCompletionMenu, setShowCompletionMenu] = useState(false);

  // store timeout id so we can clear it when needed
  const alreadyAnsweredTimeoutRef = useRef(null);

  useEffect(() => {
    // cleanup on unmount
    return () => {
      if (alreadyAnsweredTimeoutRef.current) {
        clearTimeout(alreadyAnsweredTimeoutRef.current);
      }
    };
  }, []);

  const questions = {
    1: {
      question: "Risa sedang memiliki waktu luang dan dia memiliki beberapa sampah bekas yang terlihat digambar, bantu risa memilih apa yang cocok untuk dia buat sesuai bahan yang ada!",
      image: "img/quiz/Risa/P.png",
      correctAnswer: 'C',
      choices: [
        { id: 'A', image: "/img/quiz/Risa/A.png", label: "Tempat Pensil" },
        { id: 'B', image: "/img/quiz/Risa/B.png", label: "Celengan" },
        { id: 'C', image: "/img/quiz/Risa/C.png", label: "Aksesoris" }
      ]
    },
    2: {
        question: "Aku punya pertanyaan, coba sebutkan apa saja 3R itu?",
      image: "/img/quiz/AKu/P.png",
      correctAnswer: 'B',
      choices: [
        { id: 'A', image: "/img/quiz/AKu/A.png", label: "" },
        { id: 'B', image: "/img/quiz/AKu/B.png", label: "" },
        { id: 'C', image: "/img/quiz/AKu/C.png", label: "" }]
    },
    3: {
      question: "Halo Aku ardi, apa yang harus aku lakukan dengan mengurangi sampah, bantu aku cara mengurangi sampah",
      image: "/img/quiz/Ardi/P.png",
      correctAnswer: 'A',
      choices: [
        { id: 'A', image: "/img/quiz/Ardi/A.png", label: "Membuang sampah seperti biasanya" },
        { id: 'B', image: "/img/quiz/Ardi/B.png", label: "Mendaur ulang barang barang yang bisa didaur ulang" },
        { id: 'C', image: "/img/quiz/Ardi/C.png", label: "Membiarkannya saja karna biasa saja" }
      ]
    },
    4: {
      question: "Dewi sedang memikirkan untuk memanfaatkan sampahnya dari plastik, bantu dia pilih apa yang bisa dia manfaatkan dari sampah plastiknya",
      image: "/img/quiz/Dewi/P.png",
      correctAnswer: 'A',
      choices: [
        { id: 'A', image: "/img/quiz/Dewi/A.png", label: "Ecobrick" },
        { id: 'B', image: "/img/quiz/Dewi/B.png", label: "Tempat Pensil" },
        { id: 'C', image: "/img/quiz/Dewi/C.png", label: "Rumah Stick" }
      ]
    },
    5: {
      question: "Mila menemukan sampah  seperti ini, bantu mila memilih tempat sampah yang cocok untuk dibuang!",
      image: "/img/quiz/Mila/P.png",
      correctAnswer: 'A',
      choices: [
        { id: 'A', image: "/img/quiz/Mila/A.png", label: "" },
        { id: 'B', image: "/img/quiz/choices/5b.jpg", label: "Lampu Hias" },
        { id: 'C', image: "/img/quiz/Mila/C.png", label: "" }
      ]
    }
  };

  const CompletionMenu = () => {
    const totalQuestions = Object.keys(questions).length;
    const correctAnswers = Object.values(answeredQuestions).filter(q => q.isCorrect).length;

    const handleReset = () => {
      setAnsweredQuestions({});
      setScore(0);
      setShowCompletionMenu(false);
    };

    const handleBack = () => {
      setShowCompletionMenu(false);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 animate-fadeIn">
        <div className="bg-gradient-to-br from-green-400 to-green-600 rounded-3xl shadow-2xl p-8 md:p-12 max-w-md w-[90%]">
          <div className="text-center">
            <div className="text-6xl md:text-7xl mb-6">🎉</div>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Quiz Selesai!</h2>
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 mb-6">
              <p className="text-xl md:text-2xl text-white font-semibold mb-2">Skor Akhir</p>
              <p className="text-5xl md:text-6xl font-bold text-white mb-2">{score}</p>
              <p className="text-lg text-white/90">dari {totalQuestions} pertanyaan</p>
              <div className="mt-4 pt-4 border-t border-white/30">
                <p className="text-white/90">Jawaban Benar: <span className="font-bold text-white">{correctAnswers}</span></p>
                <p className="text-white/90">Jawaban Salah: <span className="font-bold text-white">{totalQuestions - correctAnswers}</span></p>
              </div>
            </div>
            <div className="space-y-3">
              <button onClick={handleReset} className="w-full px-8 py-4 bg-white text-green-600 rounded-xl font-bold text-lg hover:bg-green-50 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg">
                Main Lagi
              </button>
             <Link to="/">
               <button onClick={handleBack} className="w-full px-8 py-4 bg-green-800 text-white rounded-xl font-bold text-lg hover:bg-green-900 transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg flex items-center justify-center gap-3">
                <FaArrowLeft /> Kembali
              </button>
             </Link>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AlreadyAnsweredNotification = () => (
    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 animate-popIn">
      <div className="bg-orange-500 text-white px-8 py-6 rounded-2xl shadow-2xl border-4 border-orange-600">
        <p className="text-xl md:text-2xl font-bold text-center">Sudah Tidak Bisa Menjawab Pertanyaan</p>
      </div>
    </div>
  );

  const GrassItem = ({ imageSrc, alt, size = "medium", questionId }) => {
    const sizeClasses = {
      small: "w-12 h-12 md:w-16 md:h-16",
      medium: "w-16 h-16 md:w-24 md:h-24",
      large: "w-24 h-24 md:w-32 md:h-32"
    };

    const isAnswered = answeredQuestions[questionId];

    const handleClick = (e) => {
      // If there was a previous timeout, clear it (so we don't have multiple timers)
      if (alreadyAnsweredTimeoutRef.current) {
        clearTimeout(alreadyAnsweredTimeoutRef.current);
        alreadyAnsweredTimeoutRef.current = null;
      }

      // If this item is already answered, show the notification for 2 seconds.
      // Stop propagation so the stage-level click handler won't immediately hide it.
      if (isAnswered) {
        e.stopPropagation();
        setShowAlreadyAnswered(false); // reset in case it was already true
        setTimeout(() => {
          // small next-tick to ensure CSS reflow for animation if needed
          setShowAlreadyAnswered(true);
        }, 10);

        alreadyAnsweredTimeoutRef.current = setTimeout(() => {
          setShowAlreadyAnswered(false);
          alreadyAnsweredTimeoutRef.current = null;
        }, 2000); // 2 seconds
      } else {
        // for unanswered items, just open the question (don't stop propagation)
        setShowAlreadyAnswered(false);
        setActiveQuestion(questionId);
      }
    };

    return (
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 hover:scale-110 transition-all duration-200 cursor-pointer" onClick={handleClick}>
        <img src={imageSrc} alt={alt} className={`${sizeClasses[size]} object-contain drop-shadow-lg ${isAnswered ? 'opacity-50' : ''}`} />
      </div>
    );
  };

  const QuestionPopup = ({ questionData, questionId }) => {
    const handleAnswer = (choiceId) => {
      if (showResults) return;
      setSelectedAnswer(choiceId);
      setShowResults(true);
      if (choiceId === questionData.correctAnswer) {
        setScore(prevScore => prevScore + 1);
      }
      setTimeout(() => {
        setAnsweredQuestions(prev => ({ 
          ...prev, 
          [questionId]: { selectedAnswer: choiceId, isCorrect: choiceId === questionData.correctAnswer }
        }));
      }, 100);
    };

    const handleClose = () => {
      setActiveQuestion(null);
      setSelectedAnswer(null);
      setShowResults(false);
      setTimeout(() => {
        const totalQuestions = Object.keys(questions).length;
        const answeredCount = Object.keys(answeredQuestions).length;
        if (answeredCount >= totalQuestions) {
          setShowCompletionMenu(true);
        }
      }, 200);
    };

    const getChoiceStyle = (choiceId) => {
      if (!showResults) return "bg-white border-4 border-green-700 hover:border-green-500 hover:shadow-xl";
      if (choiceId === questionData.correctAnswer) return "bg-green-100 border-4 border-green-500 shadow-xl";
      if (choiceId === selectedAnswer && choiceId !== questionData.correctAnswer) return "bg-red-100 border-4 border-red-500 shadow-xl";
      return "bg-gray-100 border-4 border-gray-300 opacity-60";
    };

    return (
      <div>
        <div className="fixed inset-0 z-50 max-sm:flex items-center justify-center bg-black/70 p-4 overflow-y-auto hidden">
        <div className="w-full max-w-6xl my-auto">
          <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="p-4 sm:p-6 md:p-8">
              <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 text-center mb-4 sm:mb-6 leading-relaxed">
                {questionData.question}
              </p>
              {questionData.image && (
                <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
                  <img 
                    src={questionData.image} 
                    alt="Question illustration" 
                    className="max-w-full h-auto max-h-40 sm:max-h-48 md:max-h-64 lg:max-h-80 rounded-xl sm:rounded-2xl shadow-lg object-contain" 
                  />
                </div>
              )}
            </div>

            <div className="px-4 sm:px-6 md:px-8 pb-4 sm:pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 md:gap-6 mb-4 sm:mb-6">
                {questionData.choices.map((choice) => (
                  <button 
                    key={choice.id} 
                    onClick={() => handleAnswer(choice.id)} 
                    disabled={showResults} 
                    className={`${getChoiceStyle(choice.id)} rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 transform ${!showResults ? 'hover:-translate-y-2 sm:hover:-translate-y-7 active:scale-95 cursor-pointer' : 'cursor-default'}`}
                  >
                    <div className="p-3 sm:p-4">
                      <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-700 mb-2 sm:mb-3 text-center">
                        {choice.id}
                        {showResults && choice.id === questionData.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
                        {showResults && choice.id === selectedAnswer && choice.id !== questionData.correctAnswer && <span className="ml-2 text-red-600">✗</span>}
                      </div>
                      <div className="w-full h-24 sm:h-28 md:h-32 lg:h-40 flex items-center justify-center mb-2 sm:mb-3 rounded-lg">
                        <img 
                          src={choice.image} 
                          alt={choice.label} 
                          className="max-w-full max-h-full object-contain p-1 sm:p-2" 
                        />
                      </div>
                      {choice.label && (
                        <p className="text-xs sm:text-sm md:text-base font-medium text-gray-700 text-center px-1 sm:px-2">
                          {choice.label}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {showResults && (
                <div className="mb-4 sm:mb-6 text-center">
                  {selectedAnswer === questionData.correctAnswer ? (
                    <div className="bg-green-100 border-2 border-green-500 rounded-xl p-3 sm:p-4 animate-slideUp">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-green-700">🎉 Benar! Jawaban kamu tepat!</p>
                    </div>
                  ) : (
                    <div className="bg-red-100 border-2 border-red-500 rounded-xl p-3 sm:p-4 animate-slideUp">
                      <p className="text-lg sm:text-xl md:text-2xl font-bold text-red-700">Oops! Jawaban yang benar adalah {questionData.correctAnswer}</p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-center">
                <button 
                  onClick={handleClose} 
                  className="px-6 py-2 sm:px-8 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium text-sm sm:text-base transition-colors duration-200"
                >
                  {showResults ? 'Lanjut' : 'Tutup'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed inset-0 z-50 flex items-center flex-col gap-20 justify-center bg-black/70 max-sm:hidden">
        <div className="bg-white rounded-3xl shadow-2xl max-w-6xl w-[95%] md:w-[90%] max-h-[90vh] overflow-y-auto mx-4" onClick={(e) => e.stopPropagation()}>
          <div className='p-4 md:p-8'>
            <p className="text-lg md:text-2xl text-gray-800 text-center mb-4 md:mb-6 leading-relaxed px-2">{questionData.question}</p>
            {questionData.image && (
              <div className="flex justify-center mb-6 md:mb-8">
                <img src={questionData.image} alt="Question illustration" className="max-w-full h-auto max-h-48 md:max-h-80 rounded-2xl shadow-lg object-contain" />
              </div>
            )}
          </div>

          
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {questionData.choices.map((choice) => (
                <button key={choice.id} onClick={() => handleAnswer(choice.id)} disabled={showResults} className={`${getChoiceStyle(choice.id)} rounded-2xl overflow-hidden transition-all duration-300 transform ${!showResults ? 'hover:-translate-y-7 active:scale-95 cursor-pointer' : 'cursor-default'}`}>
                  <div className="p-4">
                    <div className="text-4xl md:text-5xl font-bold text-green-700 mb-3 text-center">
                      {choice.id}
                      {showResults && choice.id === questionData.correctAnswer && <span className="ml-2 text-green-600">✓</span>}
                      {showResults && choice.id === selectedAnswer && choice.id !== questionData.correctAnswer && <span className="ml-2 text-red-600">✗</span>}
                    </div>
                    <p className="text-sm md:text-base font-medium text-gray-700 text-center w-60">{choice.label}</p>
                    <div className="w-full h-32 md:h-40 flex items-center justify-center mb-3  rounded-lg">
                      <img src={choice.image} alt={choice.label} className="max-w-full max-h-full object-contain p-2" />
                    </div>
                  </div>
                </button>
              ))}
            </div>
            {showResults && (
              <div className="mt-6 text-center">
                {selectedAnswer === questionData.correctAnswer ? (
                  <div className="bg-green-100 border-2 border-green-500 rounded-xl p-4 animate-slideUp">
                    <p className="text-xl md:text-2xl font-bold text-green-700">🎉 Benar! Jawaban kamu tepat!</p>
                  </div>
                ) : (
                  <div className="bg-red-100 border-2 border-red-500 rounded-xl p-4 animate-slideUp">
                    <p className="text-xl md:text-2xl font-bold text-red-700">Oops! Jawaban yang benar adalah {questionData.correctAnswer}</p>
                  </div>
                )}
              </div>
            )}
            <div className="flex justify-center pb-4 md:pb-6">
            <button onClick={handleClose} className="px-6 py-2 md:px-8 md:py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-medium transition-colors duration-200">
              {showResults ? 'Lanjut' : 'Tutup'}
            </button>
          </div>
      </div>
                </div>
    );
  };

  // Stage-level click handler: clicking anywhere on the stage hides the "already answered" notification.
  const handleStageClick = () => {
    if (alreadyAnsweredTimeoutRef.current) {
      clearTimeout(alreadyAnsweredTimeoutRef.current);
      alreadyAnsweredTimeoutRef.current = null;
    }
    setShowAlreadyAnswered(false);
  };

  return (
    // attach stage-level click handler here
    <div className="w-full h-screen bg-black relative overflow-hidden" onClick={handleStageClick}>
      <div className="absolute top-4 right-4 z-10 bg-white rounded-xl shadow-lg px-4 md:px-6 py-2 md:py-3">
        <p className="text-lg md:text-2xl font-bold text-green-700">Skor: <span className="text-3xl md:text-4xl">{score}</span></p>
      </div>

      <div className="absolute top-0 left-0 w-[20%] md:w-1/4 h-[35%] md:h-2/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]">
        <GrassItem imageSrc={`/img/quiz/belum/1${answeredQuestions[1] ? "sdh" : "blm"}.png`} alt="Item 1" size="large" questionId={1} />
      </div>
      <div className="absolute top-0 left-[20%] md:left-1/4 right-[35%] md:right-1/3 h-[35%] md:h-2/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]">
        <GrassItem imageSrc={`/img/quiz/belum/2${answeredQuestions[2] ? "sdh" : "blm"}.png`} alt="Item 2" size="large" questionId={2} />
      </div>
      <div className="absolute top-0 right-0 w-[35%] md:w-1/3 h-[35%] md:h-2/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]">
        <GrassItem imageSrc={`/img/quiz/belum/3${answeredQuestions[3] ? "sdh" : "blm"}.png`} alt="Item 3" size="large" questionId={3} />
      </div>
      <div className="absolute bottom-0 left-0 w-[18%] md:w-1/5 h-[50%] md:h-3/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]"></div>
      <div className="absolute bottom-0 left-[18%] md:left-1/5 right-[48%] md:right-1/2 h-[50%] md:h-3/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]">
        <GrassItem imageSrc={`/img/quiz/belum/5${answeredQuestions[5] ? "sdh" : "blm"}.png`} alt="Item 5" size="large" questionId={5} />
      </div>
      <div className="absolute bottom-0 right-0 w-[48%] md:w-1/2 h-[50%] md:h-3/5 bg-green-600 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iOCIgY3k9IjgiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjI1IiBjeT0iMTUiIHI9IjIiIGZpbGw9IiNmZjAwMDAiIG9wYWNpdHk9IjAuNiIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iMzAiIHI9IjIiIGZpbGw9IiNmZmZmZmYiIG9wYWNpdHk9IjAuNiIvPjwvc3ZnPg==')]">
        <GrassItem imageSrc={`/img/quiz/belum/4${answeredQuestions[4] ? "sdh" : "blm"}.png`} alt="Item 4" size="large" questionId={4} />
      </div>

      <div className="absolute top-0 left-[20%] md:left-1/4 w-12 md:w-20 h-[35%] md:h-2/5 bg-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-full flex flex-col justify-around py-2 md:py-4">
          {[...Array(6)].map((_, i) => <div key={i} className="w-0.5 md:w-1 h-4 md:h-8 bg-white"></div>)}
        </div>
      </div>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 md:w-20 h-[35%] md:h-2/5 bg-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-full flex flex-col justify-around py-2 md:py-4">
          {[...Array(6)].map((_, i) => <div key={i} className="w-0.5 md:w-1 h-4 md:h-8 bg-white"></div>)}
        </div>
      </div>
      <div className="absolute top-0 right-[35%] md:right-1/3 w-12 md:w-20 h-[35%] md:h-2/5 bg-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-full flex flex-col justify-around py-2 md:py-4">
          {[...Array(6)].map((_, i) => <div key={i} className="w-0.5 md:w-1 h-4 md:h-8 bg-white"></div>)}
        </div>
      </div>
      <div className="absolute bottom-0 left-[18%] md:left-1/5 w-12 md:w-20 h-[50%] md:h-3/5 bg-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-full flex flex-col justify-around py-2 md:py-4">
          {[...Array(8)].map((_, i) => <div key={i} className="w-0.5 md:w-1 h-4 md:h-8 bg-white"></div>)}
        </div>
      </div>
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 md:w-20 h-[50%] md:h-3/5 bg-gray-800">
        <div className="absolute left-1/2 -translate-x-1/2 w-0.5 md:w-1 h-full flex flex-col justify-around py-2 md:py-4">
          {[...Array(8)].map((_, i) => <div key={i} className="w-0.5 md:w-1 h-4 md:h-8 bg-white"></div>)}
        </div>
      </div>
      <div className="absolute top-[35%] md:top-2/5 left-0 w-full h-12 md:h-20 bg-gray-800">
        <div className="absolute top-1/2 -translate-y-1/2 h-0.5 md:h-1 w-full flex flex-row justify-around px-2 md:px-4">
          {[...Array(15)].map((_, i) => <div key={i} className="h-0.5 md:h-1 w-6 md:w-12 bg-white"></div>)}
        </div>
      </div>

      <div className="absolute top-[35%] md:top-2/5 left-[20%] md:left-1/4 w-12 md:w-20 h-12 md:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 100 L 0 50 Q 0 0 50 0 L 100 0 L 100 100 Z" fill="#1f2937" />
          <path d="M 5 50 Q 5 5 50 5" stroke="white" strokeWidth="1" fill="none" strokeDasharray="8,8" />
        </svg>
      </div>
      <div className="absolute top-[35%] md:top-2/5 left-1/2 -translate-x-1/2 w-12 md:w-20 h-12 md:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 0 L 100 0 L 100 100 L 50 100 Q 0 100 0 50 Z" fill="#1f2937" />
          <path d="M 50 95 Q 5 95 5 50" stroke="white" strokeWidth="1" fill="none" strokeDasharray="8,8" />
        </svg>
      </div>
      <div className="absolute top-[35%] md:top-2/5 right-[35%] md:right-1/3 w-12 md:w-20 h-12 md:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 0 100 L 0 0 L 100 0 L 100 50 Q 100 100 50 100 Z" fill="#1f2937" />
          <path d="M 95 50 Q 95 95 50 95" stroke="white" strokeWidth="1" fill="none" strokeDasharray="8,8" />
        </svg>
      </div>
      <div className="absolute top-[35%] md:top-2/5 left-[18%] md:left-1/5 w-12 md:w-20 h-12 md:h-20">
        <svg className="w-full h-full" viewBox="0 0 100 100">
          <path d="M 100 0 L 100 100 L 0 100 L 0 50 Q 0 0 50 0 Z" fill="#1f2937" />
          <path d="M 5 50 Q 5 5 50 5" stroke="white" strokeWidth="1" fill="none" strokeDasharray="8,8" />
        </svg>
      </div>

      {activeQuestion && <QuestionPopup questionData={questions[activeQuestion]} questionId={activeQuestion} />}
      {showAlreadyAnswered && <AlreadyAnsweredNotification />}
      {showCompletionMenu && <CompletionMenu />}

      <style jsx>{`
        @keyframes popIn {
          from {
            transform: translate(-50%, -50%) scale(0.5);
            opacity: 0;
          }
          to {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-popIn { animation: popIn 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
        .animate-slideUp { animation: slideUp 0.4s ease-out; }
      `}</style>
    </div>
  );
}
