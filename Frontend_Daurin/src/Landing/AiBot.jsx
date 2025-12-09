import React from 'react'
import { Link } from 'react-router'

const AiBot = () => {
  return (
    <section className='flex flex-col mt-64 items-center gap-10' id='recy'>
      <h1 className='text-3xl text-[#005048] text-center'>
        Bingung Mau Buat Karya apa? Tanyakan pada Recy
      </h1>

      <Link to='/recy'>
      <img src="/img/Recyc.png" className='w-[500px] h-[500px] hover:-rotate-6 hover:scale-105 transition-all duration-300' alt="" />
      </Link>
    </section>
  )
}

export default AiBot
