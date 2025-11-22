import React from 'react'

const AyoEdukasi = () => {
  return (
    <section className='mt-32'>
      <h1 className='text-3xl text-center text-[#005048] font-medium mb-10'>Ayo!! Edukasi Dirimu</h1>
      <h2 className='text-xl text-center text-[#005048]'>Kenali 3 Jenis sampah</h2>
      <div>
        <div>
          <h1>Sampah Organik</h1>
          <div className='text-0 bg-[#005048] w-[178px] h-[4px]'>.</div>
          <p className='max-w-[592px]'>Sampah organik adalah jenis sampah yang berasal dari makhluk hidup, baik tumbuhan maupun hewan, yang dapat terurai secara alami oleh mikroorganisme. Karena sifatnya yang mudah membusuk, sampah organik dapat diolah kembali menjadi kompos atau bahan bermanfaat lainnya.</p>
          <div>
            <ul className='flex gap-20 text-sm text-white bg-[#00796D] w-[391px] h-[42px] items-center justify-center rounded-xl'>
              <li>Pengertian</li>
              <li>Contoh</li>
              <li>Ciri Ciri</li>
            </ul>
          </div>
        </div>
        <div></div>
      </div>
    </section>
  )
}

export default AyoEdukasi
