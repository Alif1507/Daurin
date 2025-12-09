import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { Link } from "react-router";

const GameCard = ({ link, title, image, isActive }) => {
  return (
    <div
      className={`
        flex flex-col gap-6 md:gap-10 items-center relative z-20
        transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        ${isActive ? "opacity-100 scale-100" : "opacity-0 scale-90"}
      `}
    >
      <div className="relative group">
        <img
          className={`
            w-[280px] h-[180px] sm:w-[350px] sm:h-[220px] md:w-[451px] md:h-[257px] 
            rounded-2xl shadow-xl
            transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
            ${isActive ? "group-hover:scale-105 group-hover:shadow-2xl" : ""}
          `}
          src={image}
          alt={title}
        />
      </div>
      <Link to={link}>
          <button
        className={`
          toggleBg toggleText text-[#005048] 
          text-2xl md:text-3xl py-2 px-8 md:px-6 
          rounded-2xl font-bold shadow-2xl
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${
            isActive
              ? "hover:opacity-75 hover:scale-105 hover:-translate-y-1"
              : ""
          }
        `}
      >
        {title}
      </button>
      </Link>
    </div>
  );
};

const GameAndQuiz = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const items = [
    {
      title: "GAME",
      image: "img/space-odyssey.jpg",
      link: "/game"
    },
    {
      title: "QUIZ",
      image: "img/space-odyssey.jpg",
      link: "/quiz"
    },
  ];

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
  };

  return (
    <section className="toggleButton relative p-6 md:p-10 overflow-hidden flex flex-col md:flex-row justify-around items-center mt-20 md:mt-64 min-h-[400px] md:min-h-0">
      {/* Background Grid */}
      <img
        src="/img/bggrid.png"
        alt=""
        className="
          absolute inset-0 w-full h-full object-cover
          [mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_50%)]
          [-webkit-mask-image:radial-gradient(circle_at_center,rgba(0,0,0,1)_0%,rgba(0,0,0,0)_50%)]
        "
      />

      {/* Mobile Carousel */}
      <div className="md:hidden w-full relative flex items-center justify-center">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 
                     w-12 h-12 flex items-center justify-center
                     bg-[#5A9A92] rounded-full shadow-lg
                     hover:bg-[#4A8A82] transition-all duration-300
                     hover:scale-110"
          aria-label="Previous"
        >
          <IoIosArrowBack className="size-6 text-white" />
        </button>

        {/* Cards Container */}
        <div className="relative w-full max-w-[320px] sm:max-w-[400px] h-[340px] flex items-center justify-center">
          {items.map((item, index) => {
            const position = (index - activeIndex + items.length) % items.length;

            return (
              <div
                key={index}
                className={`
                  absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)]
                  ${
                    position === 0
                      ? "left-1/2 -translate-x-1/2 z-30"
                      : position === 1
                      ? "left-[85%] z-10 pointer-events-none"
                      : "left-[-35%] z-10 pointer-events-none"
                  }
                `}
              >
                <GameCard
                  title={item.title}
                  image={item.image}
                  link={item.link}
                  isActive={position === 0}
                />
              </div>
            );
          })}
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 
                     w-12 h-12 flex items-center justify-center
                     bg-[#5A9A92] rounded-full shadow-lg
                     hover:bg-[#4A8A82] transition-all duration-300
                     hover:scale-110"
          aria-label="Next"
        >
          <IoIosArrowForward className="size-6 text-white" />
        </button>
      </div>

      {/* Desktop Layout */}
      <div className="hidden md:flex flex-row gap-16 lg:gap-24 justify-center items-center w-full">
        {items.map((item, index) => (
          <GameCard
            key={index}
            title={item.title}
            image={item.image}
            link={item.link}
            isActive={true}
          />
        ))}
      </div>
    </section>
  );
};

export default GameAndQuiz;