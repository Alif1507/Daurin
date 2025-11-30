import React from "react";
import Switch from "./components/Switch";
import { useTheme } from "../context/ThemeContext";

const Hero = () => {
  const { theme } = useTheme();
  return (
    <section className="flex flex-col text-[#005048] w-screen justify-center items-center mt-50 max-sm:hidden">
      <h1 className="text-4xl font-bold mb-3 mr-60 toggleTextTitle">Welcome To Daurin</h1>
      <div className="flex flex-row gap-5">
        <div className="mb-10">
          <ul className="text-end flex flex-col gap-2">
            <li>
              <button className={`${theme === "light" ? "bg-[#00796D]" : "bg-[#00FFE5]"} font-light ${theme === "light" ? "text-white" : "text-black"} pl-6 pr-1 rounded-lg text-center`}>
                Reuse
              </button>
            </li>
            <li>
              <button className={`${theme === "light" ? "bg-[#00796D]/80" : "bg-[#00FFE5]/80"} font-light ${theme === "light" ? "text-white" : "text-black"} pl-10 pr-1 rounded-lg`}>
                Reduce
              </button>
            </li>
            <li className={`${theme === "light" ? "bg-[#00796D]/60" : "bg-[#00FFE5]/60"} font-light ${theme === "light" ? "text-white" : "text-black"} pl-15 pr-1 rounded-lg`}>
              <button>Recycle</button>
            </li>
          </ul>
        </div>
        <div className="toggleTextTitle">
          <h1 className="text-4xl font-bold">Jadikan Bumi Lebih Baik</h1>
          <p>
            Lindungi Bumi hanya dengan pilah sampah, ketahui <br /> tentang sampah dan
            dampaknya untuk bumi
          </p>
        </div>
      </div>

      <Switch />
    </section>
  );
};

export default Hero;
