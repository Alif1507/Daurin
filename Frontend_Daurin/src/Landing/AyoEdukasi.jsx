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
      ],
      title: "Sampah Organik"
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
      ],
      title: "Sampah Anorganik"
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
      ],
      title: "Sampah B3"
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
    setJenisSampahVar((prev) => {
      const next = prev + 1;
      return next > 2 ? 0 : next;
    })
  }

  const organikToggleKurang = () => {
    setJenisSampahVar((prev) => {
      const next = prev - 1;
      return next < 0 ? 2 : next;
    })
  }

  const textSampah = () => {
    const current = sampah[jenisSampahVar] || sampah[0];

    switch (sampahVar) {
      case 0:
        return <p className="text-sm sm:text-base md:text-lg leading-relaxed">{current.pengartian}</p>

      case 1:
        return (
          <ul className='list-disc pl-5 text-sm sm:text-base md:text-lg space-y-1'>
            {current.contoh.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
      
      case 2:
        return (
          <ul className='list-disc pl-5 text-sm sm:text-base md:text-lg space-y-1'>
            {current.ciri.map((item, i) => (
              <li key={i}>{item}</li>
            ))}
          </ul>
        )
    
      default:
        return null
    }
  }

  return (
    <section className='mt-20 md:mt-32 px-4 md:px-6' id='edukasi'>
      <h1 className='text-2xl md:text-3xl text-center toggleText font-medium mb-6 md:mb-10'>
        Ayo!! Edukasi Dirimu
      </h1>
      <h2 className='text-lg md:text-xl text-center toggleText mb-8 md:mb-16'>
        Kenali 3 Jenis sampah
      </h2>

      {/* Mobile Layout */}
      <div className='flex flex-col lg:hidden items-center gap-8'>
        {/* Image Carousel - Mobile */}
        <div className='w-full max-w-[300px] h-[200px] relative flex items-center justify-center'>
          <button 
            onClick={organikToggleKurang}
            className='absolute left-0 z-10 p-2 hover:bg-white/10 rounded-full transition'
            aria-label="Previous"
          >
            <IoIosArrowBack className='size-6 md:size-7 toggleText' />
          </button>
          
          <div className='w-[180px] h-[180px] relative'>
            <img 
              className={`absolute transition-all duration-500 ease-in-out ${
                jenisSampahVar === 2 ? "left-[50%] -translate-x-1/2 scale-100 opacity-100" : 
                jenisSampahVar === 0 ? "left-[-100%] scale-75 opacity-0" : 
                "left-[200%] scale-75 opacity-0"
              } bottom-0 w-full`} 
              src="/img/jenisSampah/Nonorganik.png" 
              alt="B3" 
            />
            <img 
              className={`absolute transition-all duration-500 ease-in-out ${
                jenisSampahVar === 1 ? "left-[50%] -translate-x-1/2 scale-100 opacity-100" : 
                jenisSampahVar === 2 ? "left-[-100%] scale-75 opacity-0" : 
                "left-[200%] scale-75 opacity-0"
              } bottom-0 w-full`} 
              src="/img/jenisSampah/B3.png" 
              alt="Nonorganik" 
            />
            <img 
              className={`absolute transition-all duration-500 ease-in-out ${
                jenisSampahVar === 0 ? "left-[50%] -translate-x-1/2 scale-100 opacity-100" : 
                jenisSampahVar === 1 ? "left-[-100%] scale-75 opacity-0" : 
                "left-[200%] scale-75 opacity-0"
              } bottom-0 w-full`} 
              src="/img/jenisSampah/organik.png" 
              alt="organik" 
            />
          </div>

          <button 
            onClick={organikToggleTambah}
            className='absolute right-0 z-10 p-2 hover:bg-white/10 rounded-full transition'
            aria-label="Next"
          >
            <IoIosArrowForward className='size-6 md:size-7 toggleText' />
          </button>
        </div>

        {/* Content - Mobile */}
        <div className='w-full flex flex-col gap-4 toggleText'>
          <div>
            <h3 className='text-lg md:text-xl font-medium'>
              {sampah[jenisSampahVar].title}
            </h3>
            <div className='toggleButton w-[80px] h-[3px] mt-1'>.</div>
          </div>

          <div className='min-h-[200px]'>
            {textSampah()}
          </div>

          {/* Tab Navigation - Mobile */}
          <div className='w-full overflow-x-auto'>
            <ul className='flex gap-10 text-xs sm:text-sm text-white bg-[#00796D] min-w-[320px] h-[50px] sm:h-[62px] items-center justify-center rounded-xl relative px-2'>
              <div 
                className={`text-[0px] absolute bg-[#005048] top-[50%] transition-all duration-200 -translate-y-[50%] h-[40px] sm:h-[50px] rounded-xl ${
                  sampahVar === 0 ? 'left-5 w-[95px] sm:w-[110px]' : 
                  sampahVar === 1 ? 'left-[43%] w-[70px] sm:w-[80px]' : 
                  'left-[72%] w-[75px] sm:w-[85px]'
                }`}
              >
                .
              </div>
              <li 
                onClick={pengartianToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 px-3 py-2 z-10'
              >
                Pengertian
              </li>
              <li 
                onClick={contohToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 px-3 py-2 z-10'
              >
                Contoh
              </li>
              <li 
                onClick={ciriToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 px-3 py-2 z-10'
              >
                Ciri Ciri
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className='hidden lg:flex h-[280px] items-center mt-32 justify-center gap-12'>
        <div className='text-xl flex flex-col gap-4 toggleText flex-1 max-w-[600px]'>
          <div>
            <h3 className='text-xl font-medium'>{sampah[jenisSampahVar].title}</h3>
            <div className='toggleButton w-[100px] h-[4px]'>.</div>
          </div>
          
          <div className='max-w-[592px] min-h-[120px]'>
            {textSampah()}
          </div>
          
          <div>
            <ul className='flex gap-20 text-sm text-white bg-[#00796D] w-[420px] h-[62px] items-center justify-center rounded-xl relative'>
              <div 
                className={`text-[0px] absolute bg-[#005048] top-[50%] transition-all duration-200 -translate-y-[50%] px-5 h-[50px] w-[110px] rounded-xl ${sampahVar === 1 ? "left-42" : "left-5"} ${sampahVar === 2 ? "left-74" : "left-5"}`}
              >
                .
              </div>
              <li 
                onClick={pengartianToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 z-10'
              >
                Pengertian
              </li>
              <li 
                onClick={contohToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 z-10'
              >
                Contoh
              </li>
              <li 
                onClick={ciriToggle} 
                className='relative cursor-pointer hover:text-gray-200 transition-all duration-200 z-10'
              >
                Ciri Ciri
              </li>
            </ul>
          </div>
        </div>

        {/* Image Carousel - Desktop */}
       <div className='w-[50%] flex items-center justify-center'>
          <div className='w-[400px] h-[220px] relative flex items-end justify-center'>
            <button 
              onClick={organikToggleKurang}
              className='absolute top-[50%] -left-12 -translate-y-1/2 hover:scale-110 transition z-50'
              aria-label="Previous"
            >
              <IoIosArrowBack className='size-7 toggleText' />
            </button>
            
            <button 
              onClick={organikToggleTambah}
              className='absolute top-[50%] -right-12 -translate-y-1/2 hover:scale-110 transition z-50'
              aria-label="Next"
            >
              <IoIosArrowForward className='size-7 toggleText' />
            </button>
            
            {/* Nonorganik - Index 2 (Red bin) */}
            <img 
              className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                jenisSampahVar === 2 
                  ? "left-1/2 -translate-x-1/2 w-[160px] z-30 opacity-100" 
                  : jenisSampahVar === 0 
                  ? "left-0 w-[120px] z-10 opacity-70" 
                  : "right-0 w-[120px] z-10 opacity-70"
              } bottom-0 h-auto`} 
              src="/img/jenisSampah/Nonorganik.png" 
              alt="Nonorganik" 
            />
            
            {/* B3 - Index 1 (Blue bin) */}
            <img 
              className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                jenisSampahVar === 1 
                  ? "left-1/2 -translate-x-1/2 w-[160px] z-30 opacity-100" 
                  : jenisSampahVar === 2 
                  ? "left-0 w-[120px] z-10 opacity-70" 
                  : "right-0 w-[120px] z-10 opacity-70"
              } bottom-0 h-auto`} 
              src="/img/jenisSampah/B3.png" 
              alt="B3" 
            />
            
            {/* Organik - Index 0 (Green bin) */}
            <img 
              className={`absolute transition-all duration-700 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
                jenisSampahVar === 0 
                  ? "left-1/2 -translate-x-1/2 w-[160px] z-30 opacity-100" 
                  : jenisSampahVar === 1 
                  ? "left-0 w-[120px] z-10 opacity-70" 
                  : "right-0 w-[120px] z-10 opacity-70"
              } bottom-0 h-auto`} 
              src="/img/jenisSampah/organik.png" 
              alt="Organik" 
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default AyoEdukasi