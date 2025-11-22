import { IoCameraOutline } from "react-icons/io5";

const IdentifikasiSampah = () => {
  return (
    <section className='mt-32 flex flex-col items-center justify-center'>
      <h1 className='text-3xl text-[#005048] text-center mb-16'>
        Identikasi Jenis Sampah
      </h1>
       <div className="w-full flex justify-center">
      <input id="file" type="file" className="hidden" />

      <label
        htmlFor="file"
        className="
          w-[857px] h-[499px]
          flex items-center justify-center
          rounded-2xl border-2 border-dashed border-gray-300
          cursor-pointer
          hover:border-gray-500
        "
      >
        <IoCameraOutline className="opacity-45 size-20"/>
      </label>
    </div>
    <div className="flex w-[857px] justify-between mt-8">
      <div>
        <h1>Jenis : <span className="opacity-45">(sampah)</span></h1>
      </div>
      <button className="bg-[#00796D] text-2xl p-2 px-4 rounded-2xl text-white transition-all duration-200 hover:bg-[#00796D]/70">
        Identifikasi
      </button>
    </div>
    </section>
  )
}

export default IdentifikasiSampah
