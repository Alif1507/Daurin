import React from 'react'
import Marquee from "react-fast-marquee";

const LihatKarya = () => {
  return (
    <section className='flex flex-col mt-64'>
        <h1 className='text-center text-[#005048] text-3xl'>Lihat Karya Karya Dari Sampah</h1>
       <div>
         <Marquee direction='left' pauseOnHover={true}>
            <img src="img/atas/Rectangle 24.png" alt="" />
            <img src="img/atas/Rectangle 25.png" alt="" />
            <img src="img/atas/Rectangle 26.png" alt="" />
            <img src="img/atas/Rectangle 27.png" alt="" />
        </Marquee>
       </div>

        <div>
          <Marquee direction='right' pauseOnHover={true}>
            <img src="img/bawah/Rectangle 28.png" alt="" />
            <img src="img/bawah/Rectangle 29.png" alt="" />
            <img src="img/bawah/Rectangle 30.png" alt="" />
            <img src="img/bawah/Rectangle 31.png" alt="" />
        </Marquee>
        </div>
        <button className='text-2xl bg-[#005048] ml-[100px] w-[275px] rounded-xl h-[59px] text-white px-3 py-2'>Tunjukan<span className='text-[#005048]'>_</span>Karyamu!</button>
    </section>
  )
}

export default LihatKarya
