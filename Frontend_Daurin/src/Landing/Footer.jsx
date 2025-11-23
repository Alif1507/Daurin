// src/components/Footer.jsx
import React from "react";

const Footer = () => {
  return (
    <footer className="bg-[#034A3E] text-white text-xs md:text-sm">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 md:py-10">
        {/* Top */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Left brand */}
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              {/* Logo placeholder */}
              <img src="/img/logo-dark.png" className="w-[50px] h-[50px]" alt="" />
              <div className="leading-tight font-semibold">
                <p>Duarin</p>
              </div>
            </div>

            <p className="text-[11px] md:text-xs leading-relaxed opacity-80">
              CartSmart Tempat dimana kamu bisa mengatur pengeluaran belanjaanmu
              dan melihat harga pangan dipasar
            </p>

            {/* Socials */}
            <div className="flex items-center gap-3 mt-4 text-[13px]">
              <button className="border border-white/50 rounded-full w-7 h-7 flex items-center justify-center">
                f
              </button>
              <button className="border border-white/50 rounded-full w-7 h-7 flex items-center justify-center">
                IG
              </button>
              <button className="border border-white/50 rounded-full w-7 h-7 flex items-center justify-center">
                X
              </button>
              <button className="border border-white/50 rounded-full w-7 h-7 flex items-center justify-center">
                YT
              </button>
            </div>
          </div>

          {/* Right columns */}
          <div className="flex-1 grid sm:grid-cols-2 gap-8">
            {/* Quick Links */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Quick Links</h3>

              <div className="grid grid-cols-2 gap-4 text-[11px] md:text-xs">
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[10px]">▶</span>
                    <span>Pasar</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[10px]">▶</span>
                    <span>Harga</span>
                  </li>
                </ul>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-[10px]">▶</span>
                    <span>Planner</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[10px]">▶</span>
                    <span>ChatBot</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Contact */}
            <div>
              <h3 className="font-semibold mb-3 text-sm">Contact Us</h3>

              <div className="space-y-3 text-[11px] md:text-xs">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[12px]">
                    📞
                  </div>
                  <span>+794-887-004</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full border border-white flex items-center justify-center text-[12px]">
                    ✉
                  </div>
                  <span>CartSmart@gmail.com</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 border-t border-white/20 pt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-[10px] md:text-[11px] opacity-80">
          <p>Copyright 2025 Mhigras. All rights reserved</p>

          <div className="flex gap-6">
            <button className="hover:opacity-100">Term Of Service</button>
            <button className="hover:opacity-100">Privacy Policy</button>
            <button className="hover:opacity-100">Cookies</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
