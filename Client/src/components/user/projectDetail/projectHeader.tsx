export default function ProjectHeader({ gig }: { gig: any }) {
  return (
    <div className="space-y-3 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600 border border-indigo-100">
          {gig.category || "Service"}
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${
            gig.isActive
              ? "bg-emerald-50 text-emerald-600 border-emerald-100"
              : "bg-rose-50 text-rose-600 border-rose-100"
          }`}
        >
          {gig.isActive ? "Available" : "Unavailable"}
        </span>
      </div>
      <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-snug">
        {gig.title}
      </h1>
      <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-4xl">
        {gig.pricing?.basic?.description}
      </p>
    </div>
  );
}