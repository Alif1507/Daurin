import React from "react";

const GameAndQuiz = () => {
  return (
    <section className="bg-[#005048] relative p-10 overflow-hidden flex flex-row justify-around items-center mt-64">
      <img
        src="/img/bggrid.png"
        alt=""
        className="
    absolute
    [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_50%)]
    [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_50%)]
  "
      />

      <div className="flex flex-col gap-10 items-center relative z-20">
        <img
          className="w-[451px] h-[257px] rounded-2xl"
          src="img/space-odyssey.jpg"
          alt=""
        />
        <button className="bg-white hover:opacity-75 transition-all duration-200 text-[#005048] text-3xl py-2 px-6 rounded-2xl font-bold shadow-2xl">
          Game
        </button>
      </div>
      <div className="flex flex-col gap-10 items-center relative z-20">
        <img
          className="w-[451px] h-[257px] rounded-2xl"
          src="img/space-odyssey.jpg"
          alt=""
        />
        <button className="bg-white hover:opacity-75 transition-all duration-200 text-[#005048] text-3xl py-2 px-6 rounded-2xl font-bold shadow-2xl">
          Quiz
        </button>
      </div>
    </section>
  );
};

export default GameAndQuiz;
