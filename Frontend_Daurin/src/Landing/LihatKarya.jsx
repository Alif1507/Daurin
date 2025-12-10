import React from 'react'
import Marquee from "react-fast-marquee";
import { Link } from 'react-router';

const LihatKarya = () => {
  return (
    <section className='flex flex-col mt-20 md:mt-32 lg:mt-64 px-4 md:px-6'>
      <h1 className='text-center text-[#005048] toggleText text-xl sm:text-2xl md:text-3xl font-semibold mb-8 md:mb-12'>
        Lihat Karya Karya Dari Sampah
      </h1>
      
      {/* Top Marquee */}
      <div className='mb-4 md:mb-6'>
        <Marquee direction='left' pauseOnHover={true} speed={40}>
          <img 
            src="img/atas/Rectangle 24.png" 
            alt="Karya 1" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/atas/Rectangle 25.png" 
            alt="Karya 2" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/atas/Rectangle 26.png" 
            alt="Karya 3" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/atas/Rectangle 27.png" 
            alt="Karya 4" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
        </Marquee>
      </div>
      
      {/* Bottom Marquee */}
      <div className='mb-8 md:mb-12'>
        <Marquee direction='right' pauseOnHover={true} speed={40}>
          <img 
            src="img/bawah/Rectangle 28.png" 
            alt="Karya 5" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/bawah/Rectangle 29.png" 
            alt="Karya 6" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/bawah/Rectangle 30.png" 
            alt="Karya 7" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
          <img 
            src="img/bawah/Rectangle 31.png" 
            alt="Karya 8" 
            className='w-[200px] h-[150px] sm:w-[250px] sm:h-[180px] md:w-[300px] md:h-[200px] lg:w-[350px] lg:h-[220px] object-cover rounded-xl mx-2 md:mx-3 shadow-lg'
          />
        </Marquee>
      </div>
      
      <Link to="/dashboard">
        <button className='
        text-lg sm:text-xl md:text-2xl 
        toggleButton toggleTextButton 
        mx-auto md:ml-[100px] md:mr-auto
        w-full max-w-[275px] sm:w-[275px]
        rounded-xl h-[50px] sm:h-[59px] 
        text-white px-4 py-2 
        shadow-lg
        hover:opacity-90 hover:scale-105 hover:-translate-y-1
        transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
      '>
        Tunjukan Karyamu!
      </button>
      </Link>
      
    </section>
  )
}

export default LihatKarya