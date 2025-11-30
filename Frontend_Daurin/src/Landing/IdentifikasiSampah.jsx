import { useState } from "react";
import { IoCameraOutline } from "react-icons/io5";
import { detectTrash } from "../lib/api";

const IdentifikasiSampah = () => {
  const [detectFile, setDetectFile] = useState(null);
  const [detectPreview, setDetectPreview] = useState("");
  const [detectResult, setDetectResult] = useState(null);
  const [detectLoading, setDetectLoading] = useState(false);
  const [message, setMessage] = useState("");

  const top = detectResult?.top || [];
  const primary = top[0];

  const getCategory = (label) => {
    if (!label) return "Tidak diketahui";
    const l = label.toLowerCase();
    if (l === "organic") return "Organik";
    if (["plastic", "paper", "metal", "glass"].includes(l)) return "Anorganik";
    return "B3";
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!detectFile) {
      setMessage("Pilih gambar dulu.");
      return;
    }
    setMessage("");
    setDetectLoading(true);
    setDetectResult(null);
    try {
      const data = await detectTrash(detectFile);
      setDetectResult(data);
    } catch (err) {
      setMessage("Gagal mendeteksi. Coba lagi.");
    } finally {
      setDetectLoading(false);
    }
  };

  return (
    <section className="mt-20 md:mt-32 flex flex-col items-center justify-center px-4 md:px-6">
      <h1 className="text-2xl md:text-3xl text-[#005048] text-center mb-8 md:mb-16 toggleText font-semibold">
        Identifikasi Jenis Sampah
      </h1>
      
      <div className="w-full max-w-[857px] flex flex-col items-center gap-4 md:gap-6">
        {/* File Upload Area */}
        <div className="w-full flex flex-col items-center gap-4">
          <input
            id="file"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              setDetectFile?.(file || null);
              setDetectPreview?.(file ? URL.createObjectURL(file) : "");
            }}
          />
          <label
            htmlFor="file"
            className="w-full h-[280px] sm:h-[350px] md:h-[450px] lg:h-[499px] 
                       flex items-center justify-center 
                       rounded-xl md:rounded-2xl 
                       border-2 border-dashed border-gray-300 
                       cursor-pointer hover:border-gray-500 
                       relative overflow-hidden bg-white/40
                       transition-all duration-200"
            style={{ 
              backgroundImage: detectPreview ? `url(${detectPreview})` : "none", 
              backgroundSize: "cover", 
              backgroundPosition: "center" 
            }}
          >
            {!detectPreview && (
              <div className="flex flex-col items-center gap-2">
                <IoCameraOutline className="opacity-45 size-16 md:size-20" />
                <span className="text-sm md:text-base text-gray-500">
                  Tap untuk upload gambar
                </span>
              </div>
            )}
          </label>
        </div>

        {/* Results and Button Section */}
        <div className="flex flex-col md:flex-row w-full justify-between items-start md:items-start gap-4">
          {/* Results Display */}
          <div className="w-full md:flex-1">
            <h1 className="toggleText text-base md:text-lg">
              Jenis :{" "}
              {primary ? (
                <span className="font-semibold toggleText">
                  {primary.label} ({Math.round(primary.confidence * 100)}%)
                </span>
              ) : (
                <span className="opacity-45">(sampah)</span>
              )}
            </h1>
            {primary && (
              <p className="text-sm text-slate-700 mt-1">
                Kategori: <span className="font-semibold">{getCategory(primary.label)}</span>
              </p>
            )}
            
            {primary && (
              <div className="mt-3 bg-slate-100 text-slate-800 rounded-lg p-3 md:p-4 text-sm space-y-2">
                {primary.reason && (
                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Catatan:</span> {primary.reason}
                  </p>
                )}
                <p className="text-xs text-slate-600">
                  <span className="font-semibold">Kategori:</span> {getCategory(primary.label)}
                </p>
                {top.length > 1 && (
                  <div className="text-xs toggleText space-y-1">
                    <p className="font-semibold">Top 3 prediksi:</p>
                    {top.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between py-1">
                        <span className="capitalize">{item.label}</span>
                        <span className="font-medium">{Math.round(item.confidence * 100)}%</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {message && <p className="text-sm text-red-600 mt-2">{message}</p>}
          </div>

          {/* Submit Button */}
          <button
            onClick={onSubmit}
            disabled={detectLoading || !detectPreview}
            className="w-full md:w-auto toggleButton toggleTextButton 
                       text-lg md:text-2xl p-3 px-6 md:p-2 md:px-4 
                       rounded-xl md:rounded-2xl
                       transition-all duration-200 
                       hover:bg-[#00796D]/70
                       disabled:opacity-50 disabled:cursor-not-allowed
                       whitespace-nowrap"
          >
            {detectLoading ? "Memproses..." : "Identifikasi"}
          </button>
        </div>
      </div>
    </section>
  );
};

export default IdentifikasiSampah;
