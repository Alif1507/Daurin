import React from "react";

const Section = ({ title, eyebrow, action, children }) => (
  <section className="bg-slate-900/60 border border-emerald-800/50 rounded-2xl p-5 shadow-lg shadow-emerald-900/40">
    <div className="flex items-start justify-between gap-3">
      <div>
        {eyebrow && (
          <p className="text-xs uppercase tracking-[0.2em] text-emerald-300/80 mb-1">
            {eyebrow}
          </p>
        )}
        <h2 className="text-lg font-semibold text-white/90">{title}</h2>
      </div>
      {action}
    </div>
    <div className="mt-4 space-y-4">{children}</div>
  </section>
);

export default Section;
