import React from 'react'
import Card3R from './components/Card3R'

const R3 = () => {
  const R3 = [
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

  return (
    <section className='flex flex-col items-center w-screen gap-20 mt-64'>
      <h1 className='text-2xl text-[#005048]'>
        Kenali 3R
      </h1>
      <div className='flex justify-evenly w-screen'>
        {R3.map((item) => (
          <Card3R title={item.title} desc={item.desc} img={item.img}  />
        ))}
        </div>
    </section>
  )
}

export default R3
