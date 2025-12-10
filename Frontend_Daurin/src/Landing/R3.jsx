import React, { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { useTheme } from '../context/ThemeContext';

const Card3R = ({ title, desc, img, isActive }) => {
  const [isHovered, setIsHovered] = useState(false)
  const { theme } = useTheme();
  
  return (
    <div 
      className={`
        bg-white rounded-2xl shadow-lg overflow-hidden h-full
        transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
        toggleButton
        ${isHovered && isActive 
          ? 'shadow-2xl -translate-y-2 shadow-[#005048]/20' 
          : ''
        }
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className='p-6 flex flex-col items-center gap-3 h-full'>
        <div className={`
          w-20 h-20 flex items-center justify-center flex-shrink-0
          transition-all duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          ${isHovered && isActive ? 'scale-110 rotate-6' : 'scale-100 rotate-0'}
        `}>
          <img 
            src={`/img/3R/${theme === "light" ? "dark" : ""}${img}`} 
            alt={title} 
            className='w-full h-full object-contain'
          />
        </div>
        <h3 className={`
          text-lg font-bold toggleTextButton flex-shrink-0
          transition-all duration-300 
          ${isHovered && isActive ? 'scale-105' : 'scale-100'}
        `}>
          {title}
        </h3>
        <p className={`
          text-xs text-center text-gray-600 toggleText leading-relaxed overflow-y-auto
          transition-all duration-300 toggleTextButton
          ${isHovered && isActive ? 'text-gray-800' : 'text-gray-600'}
        `}>
          {desc}
        </p>
      </div>
    </div>
  )
}

const R3 = () => {
  const [activeIndex, setActiveIndex] = useState(1) // Start with REUSE (middle card)
  
  const R3Data = [
    {
      title: "REDUCE",
      desc: "Reduce adalah upaya mengurangi penggunaan barang atau material yang berpotensi menjadi sampah. Tujuan utama reduce adalah meminimalkan jumlah sampah sejak awal, sehingga limbah yang dihasilkan lebih sedikit dan dampaknya terhadap lingkungan berkurang.",
      img: "Mask group.png"
    },
    {
      title: "REUSE",
      desc: "Reuse adalah upaya menggunakan kembali barang atau benda yang masih layak pakai agar tidak langsung menjadi sampah. Tujuannya adalah mengurangi jumlah sampah dan memperpanjang umur penggunaan suatu barang.",
      img: "Rectangle 19.png"
    },
    {
      title: "RECYCLE",
      desc: "Recycle adalah proses mendaur ulang sampah menjadi bahan baru atau produk baru yang dapat digunakan kembali. Dalam recycle, sampah yang tidak bisa dipakai lagi diproses melalui tahapan tertentu agar berubah bentuk dan fungsi sehingga tidak berakhir sebagai limbah yang mencemari lingkungan",
      img: "Rectangle 20.png"
    }
  ]

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? R3Data.length - 1 : prev - 1))
  }

  const handleNext = () => {
    setActiveIndex((prev) => (prev === R3Data.length - 1 ? 0 : prev + 1))
  }

  return (
    <section className='flex flex-col items-center w-full px-4 md:px-6 gap-12 md:gap-20 mt-32 md:mt-64'>
      <h1 className='text-2xl md:text-3xl toggleText font-semibold text-center'>
        Kenali 3R
      </h1>

      {/* Mobile Carousel */}
      <div className='lg:hidden w-full max-w-md relative'>
        <div className='relative px-12'>
          {/* Navigation Buttons */}
          <button
            onClick={handlePrev}
            className='absolute left-0 top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/20 rounded-full transition'
            aria-label="Previous"
          >
            <IoIosArrowBack className='size-6 toggleText' />
          </button>

          <button
            onClick={handleNext}
            className='absolute right-0 top-1/2 -translate-y-1/2 z-30 p-2 hover:bg-white/20 rounded-full transition'
            aria-label="Next"
          >
            <IoIosArrowForward className='size-6 toggleText' />
          </button>

          {/* Cards Container */}
          <div className='relative h-[450px] flex items-center justify-center'>
            {R3Data.map((item, index) => {
              const position = (index - activeIndex + R3Data.length) % R3Data.length
              
              return (
                <div
                  key={index}
                  className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                    position === 0
                      ? 'left-1/2 -translate-x-1/2 w-full h-[420px] z-30 opacity-100'
                      : position === 1
                      ? 'left-[75%] w-[85%] h-[400px] z-10 opacity-60'
                      : 'left-[-25%] w-[85%] h-[400px] z-10 opacity-60'
                  }`}
                >
                  <Card3R 
                    title={item.title} 
                    desc={item.desc} 
                    img={item.img}
                    isActive={position === 0}
                  />
                </div>
              )
            })}
          </div>
        </div>

        {/* Dots Indicator */}
        <div className='flex justify-center gap-2 mt-6'>
          {R3Data.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === activeIndex 
                  ? 'bg-[#005048] w-6' 
                  : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Desktop Grid */}
      <div className='hidden lg:flex justify-center gap-8 w-full max-w-7xl'>
        {R3Data.map((item, index) => (
          <div key={index} className='flex-1 max-w-sm h-[420px]'>
            <Card3R 
              title={item.title} 
              desc={item.desc} 
              img={item.img}
              isActive={true}
            />
          </div>
        ))}
      </div>
    </section>
  )
}

export default R3