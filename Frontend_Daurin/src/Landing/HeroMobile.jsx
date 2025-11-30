import React from 'react'
import { useTheme } from '../context/ThemeContext';
import Switch from './components/Switch';

const HeroMobile = () => {
   const { theme } = useTheme(); 
  return (
    <section className='max-sm:block mt-32 hidden'>
      <h1 className='text-center text-2xl font-bold toggleTextTitle'>
        Welcome To Daurin <br /> Jadikan Bumi Lebih Baik
      </h1>
      <ul className="flex flex-row text-center gap-2 justify-center mt-3">
            <li>
              <button className={`${theme === "light" ? "bg-[#00796D]" : "bg-[#00FFE5]"} font-light ${theme === "light" ? "text-white" : "text-black"} w-[115px]  rounded-lg text-center`}>
                Reuse
              </button>
            </li>
            <li>
              <button className={`${theme === "light" ? "bg-[#00796D]/80" : "bg-[#00FFE5]/80"} font-light ${theme === "light" ? "text-white" : "text-black"} w-[115px] rounded-lg`}>
                Reduce
              </button>
            </li>
            <li className={`${theme === "light" ? "bg-[#00796D]/60" : "bg-[#00FFE5]/60"} font-light ${theme === "light" ? "text-white" : "text-black"} w-[115px] rounded-lg`}>
              <button>Recycle</button>
            </li>
          </ul>
          <p className='text-xs mt-3 font-light text-center toggleTextTitle mb-5'>
            Lindungi Bumi hanya dengan pilah sampah, ketahui tentang sampah dan dampaknya untuk bumi
          </p>

          <Switch />
    </section>
  )
}

export default HeroMobile
