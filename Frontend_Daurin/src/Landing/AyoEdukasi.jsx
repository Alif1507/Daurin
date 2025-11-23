import React, { useState } from 'react'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'

const AyoEdukasi = () => {
  const [sampahVar, setSampahVar] = useState(0)
  const [jenisSampahVar, setJenisSampahVar] = useState(0)

  const sampah = [
    {
      pengartian: "Sampah organik adalah jenis sampah yang berasal dari makhluk hidup, baik tumbuhan maupun hewan, yang dapat terurai secara alami oleh mikroorganisme. Karena sifatnya yang mudah membusuk, sampah organik dapat diolah kembali menjadi kompos atau bahan bermanfaat lainnya.",
      contoh: [
        "Sisa makanan seperti nasi, sayur, roti, dan lauk pauk.",
        "Kulit buah seperti kulit pisang, kulit jeruk, dan kulit mangga.",
        "Sisa sayuran seperti batang kangkung, kulit kentang, atau daun kol.",
        "Daun kering dari pohon di halaman.",
        "Potongan rumput hasil memotong tanaman.",
        "Ampas kopi dan teh seperti bubuk kopi bekas atau kantong teh.",
        "Sisa hewan seperti tulang atau duri ikan.",
        "Kotoran hewan tertentu yang dapat dijadikan kompos (misalnya kotoran sapi atau kambing)."
      ],
      ciri: [
        "Mudah terurai secara alami oleh mikroorganisme.",
        "Cepat membusuk karena berasal dari makhluk hidup.",
        "Berbau jika dibiarkan terlalu lama.",
        "Dapat dijadikan kompos atau pupuk alami.",
        "Umumnya berasal dari sisa makhluk hidup, seperti tumbuhan dan hewan",
        "Mengandung unsur hara yang bermanfaat bagi tanah."
      ]
    },
    {
      pengartian: "Sampah anorganik adalah sampah yang tidak mudah terurai secara alami oleh mikroorganisme dan membutuhkan waktu sangat lama untuk terdegradasi. Sampah jenis ini umumnya berasal dari bahan-bahan non-hayati, hasil proses industri, atau bahan sintetis.",
      contoh: [
        "Plastik – botol plastik, kantong plastik, wadah makanan.",
        "Kaca – botol kaca, pecahan gelas, stoples kaca.",
        "Logam – kaleng minuman, kaleng makanan, aluminium foil.",
        "Karet sintetis – ban kendaraan, sandal karet.",
        "Styrofoam – kemasan makanan atau pelindung barang elektronik.",
        "Bahan elektronik – komponen komputer, charger rusak, kabel."
      ],
      ciri: [
        "Tidak mudah terurai oleh mikroorganisme.",
        "Waktu penguraian sangat lama, bisa puluhan hingga ratusan tahun.",
        "Tidak membusuk seperti sampah organik.",
        "Umumnya berasal dari bahan buatan manusia atau proses industri.",
        "Banyak yang dapat didaur ulang, seperti plastik, kaca, dan logam.",
        "Tahan terhadap cuaca dan tidak cepat rusak.",
      ]
    },
    {
      pengartian: "Sampah B3 (Bahan Berbahaya dan Beracun) adalah jenis sampah yang mengandung zat berbahaya yang dapat merusak lingkungan, membahayakan kesehatan manusia, dan mengganggu makhluk hidup lainnya. Sampah ini memerlukan penanganan khusus karena tidak bisa dibuang atau diolah sembarangan.",
      contoh: [
        "Baterai bekas (AA, AAA, baterai HP, baterai laptop).",
        "Oli atau pelumas bekas dari kendaraan atau mesin.",
        "Cat dan thinner yang sudah tidak terpakai.",
        "Pestisida atau obat pembasmi hama.",
        "Obat-obatan kedaluwarsa.",
        "Lampu neon (fluorescent) atau lampu LED tertentu yang mengandung merkuri.",
      ],
      ciri: [
        "Beracun (toxic) – dapat menyebabkan keracunan pada manusia atau hewan.",
        "Korosif – dapat merusak atau mengikis benda lain, misalnya asam kuat.",
        "Reaktif – mudah bereaksi dengan zat lain, bisa meledak atau menghasilkan gas berbahaya.",
        "Mudah terbakar (flammable) – dapat menyala atau meledak pada suhu tertentu.",
        "Mengandung bahan kimia berbahaya seperti merkuri, timbal, asam, atau pelarut kimia.",
        "Berbahaya bagi lingkungan – mencemari tanah, air, dan udara jika dibuang sembarangan."
      ]
    }

  ]

  const pengartianToggle = () => {
    setSampahVar(0)
  }

  const contohToggle = () => {
    setSampahVar(1)
  }

  const ciriToggle = () => {
    setSampahVar(2)
  }

  const organikToggleTambah = () => {
    setJenisSampahVar((prev) => prev + 1)
  }

  const organikToggleKurang = () => {
    setJenisSampahVar((prev) => prev - 1)
  }

  const textSampah = () => {
    const current = sampah[jenisSampahVar] || sampah[0];
    if (jenisSampahVar > 2) {
      setJenisSampahVar(0)
    } else if (jenisSampahVar < 0) {
      setJenisSampahVar(2)
    }
    

    switch (sampahVar) {
      case 0:
          return <p>{current.pengartian}</p>

      case 1:
          return <ul className='list-disc pl-5 text-lg'>
            {current.contoh.map((item,i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
      
      case 2:
          return <ul className='list-disc pl-5 text-lg'>
            {current.ciri.map((item,i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
    
      default:
        "hello"
        break;
    }
  }



  
  

  return (
    <section className='mt-32'>
      <h1 className='text-3xl text-center text-[#005048] font-medium mb-10'>Ayo!! Edukasi Dirimu</h1>
      <h2 className='text-xl text-center text-[#005048]'>Kenali 3 Jenis sampah</h2>
      <div className='flex h-[280px] items-center mt-64 justify-center'>
        <div className='text-xl flex flex-col gap-4 '>
          <div>
            <h1>Sampah Organik</h1>
          <div className='text-0 bg-[#005048] w-[178px] h-[4px]'>.</div>
          </div>
          <div className='max-w-[592px]'>{
            textSampah()
            }</div>
          <div>
            <ul className='flex gap-20 text-sm text-white bg-[#00796D] w-[420px] h-[62px] items-center justify-center rounded-xl relative'>
              <div className={`text-[0px] absolute bg-[#005048] top-[50%] transition-all duration-200 -translate-y-[50%] ${sampahVar === 1 ? "left-42" : "left-5"} ${sampahVar === 2 ? "left-74" : "left-5"}  px-5 h-[50px] w-[110px] rounded-xl`}>.</div>
              <li onClick={pengartianToggle} className='relative cursor-pointer hover:text-gray-200 transition-all duration-200'>Pengertian</li>
              <li onClick={contohToggle} className='relative cursor-pointer hover:text-gray-200 transition-all duration-200'>Contoh</li>
              <li onClick={ciriToggle} className='relative cursor-pointer hover:text-gray-200 transition-all duration-200'>Ciri Ciri</li>
            </ul>
          </div>
        </div>
        <div className='w-[50%] flex items-center justify-center'>
          <div className='w-[238px] h-[200px] relative'>
            <IoIosArrowBack onClick={organikToggleKurang} className='size-7 top-[50%] absolute right-[100%]' />
            <IoIosArrowForward onClick={organikToggleTambah} className='size-7 top-[50%] absolute left-[200%]' />
            <img className={`absolute transition-all duration-800 ease-in-out ${jenisSampahVar === 2 && "left-[50%]" } ${jenisSampahVar === 0 && "left-[0%] size-30" } ${jenisSampahVar === 1 && "left-[130%] size-30" }  bottom-0`} src="/img/jenisSampah/Nonorganik.png" alt="B3" />
          <img className={`absolute transition-all duration-800 ease-in-out ${jenisSampahVar === 1 && "left-[50%]" } ${jenisSampahVar === 2 && "left-[0%] size-30" } ${jenisSampahVar === 0 && "left-[130%] size-30" }  bottom-0`} src="/img/jenisSampah/B3.png" alt="Nonorganik" />
          <img className={`absolute transition-all duration-800 ease-in-out ${jenisSampahVar === 0 && "left-[50%]" } ${jenisSampahVar === 1 && "left-[0%] size-30" } ${jenisSampahVar === 2 && "left-[130%] size-30" } bottom-0 `} src="/img/jenisSampah/organik.png" alt="organik" />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AyoEdukasi
