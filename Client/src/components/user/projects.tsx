import { getProjects } from "@/api/client.api";
import { useState, useEffect } from "react";
import { InitialProjectDetail, Filters } from "@/types/user.type";
import { Link } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

function ProjectComponent() {
  const [gigs, setGigs] = useState<InitialProjectDetail[]>([]);
  const CATEGORIES = [ "Web Development", "UI/UX Design", "Graphic Design", "Digital Marketing" ];
  const emptyFilters: Filters = { search: "", category: "", skills: [], minPrice: "", maxPrice: "", minRating: "" };

  const [filters, setFilters] = useState<Filters>(emptyFilters);
  const [debouncedFilters, setDebouncedFilters] = useState<Filters>(emptyFilters);

  const updateFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedFilters(filters), 500);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    let ignore = false;
    const fetchGigs = async () => {
      const response = await getProjects(debouncedFilters);
      if (!ignore && response.success) setGigs(response.data.gigs);
    };
    fetchGigs();
    return () => {
      ignore = true;
    };
  }, [debouncedFilters]);

  return (
    <div className="bg-slate-50/50 min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-indigo-950 to-slate-900 text-white py-20 px-6">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative max-w-4xl mx-auto text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
            Professional Marketplace
          </span>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Find Skilled Freelancers for Your Next Big Project
          </h1>
          <p className="text-indigo-200 text-base md:text-lg max-w-2xl mx-auto font-normal">
            Explore top-rated services, compare prices, and hire trusted experts in web development, design, and marketing.
          </p>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
        {/* Search & Filter Container */}
        <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/60 p-6 border border-slate-100 mb-12">
          <div className="flex flex-col md:flex-row gap-4 mb-4">
            {/* Search Input */}
            <div className="relative flex-1">
              <svg
                className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                type="text"
                value={filters.search}
                onChange={(e) => updateFilter("search", e.target.value)}
                placeholder="Search services, skills, or titles..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors text-slate-800 placeholder-slate-400"
              />
            </div>

            {/* Category Select */}
            <select
              value={filters.category}
              onChange={(e) => updateFilter("category", e.target.value)}
              className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
            >
              <option value="">All Categories</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Secondary Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-100">
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Filters:
              </span>

              {/* Price inputs */}
              <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5">
                <span className="text-xs text-slate-500 font-medium">$</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Min"
                  value={filters.minPrice}
                  onChange={(e) => updateFilter("minPrice", e.target.value)}
                  className="w-16 bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                />
                <span className="text-xs text-slate-300">-</span>
                <input
                  type="number"
                  min={0}
                  placeholder="Max"
                  value={filters.maxPrice}
                  onChange={(e) => updateFilter("maxPrice", e.target.value)}
                  className="w-16 bg-transparent text-sm focus:outline-none text-slate-800 placeholder-slate-400"
                />
              </div>

              {/* Rating Select */}
              <select
                value={filters.minRating}
                onChange={(e) => updateFilter("minRating", e.target.value)}
                className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-colors cursor-pointer"
              >
                <option value="">Any Rating</option>
                <option value="4">4.0★ & above</option>
                <option value="3">3.0★ & above</option>
              </select>
            </div>

            {/* Clear Filters Button */}
            <button
              onClick={() => setFilters(emptyFilters)}
              className="text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors flex items-center gap-1.5 py-1 px-3 rounded-lg hover:bg-indigo-50"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Reset Filters
            </button>
          </div>
        </div>

        {/* Section Title */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              Top Freelancer Services
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Showing {gigs.length} available service{gigs.length !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {/* Gigs Grid */}
        {gigs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {gigs.map((gig) => (
              <Link
                to={`${userRoutes.PROJECT_DETAILS}/${gig._id}`}
                key={gig._id}
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-md transition-all duration-200 overflow-hidden"
              >
                {/* Thumbnail Image Container */}
                <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                  <img
                    src={
                      gig.gallery && gig.gallery.length > 0
                        ? gig.gallery[0]
                        : "/placeholder.jpg"
                    }
                    alt={gig.title}
                    className="w-full h-full object-cover"
                  />
                  {gig.pricing?.basic?.price && (
                    <div className="absolute bottom-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1 rounded-xl border border-slate-200/50">
                      <span className="text-xs text-slate-500 font-medium">From </span>
                      <span className="text-sm font-bold text-indigo-600">
                        ${gig.pricing.basic.price}
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    {/* Title */}
                    <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors line-clamp-1">
                      {gig.title}
                    </h3>

                    {/* Short Description */}
                    <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                      {gig.pricing?.basic?.description}
                    </p>
                  </div>

                  {/* Rating & Footer info */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="flex text-amber-400">
                        {[1, 2, 3, 4, 5].map((s) => (
                          <svg
                            key={s}
                            className={`w-4 h-4 ${
                              s <= Math.round(gig.freelancer?.rating?.average ?? 0)
                                ? "fill-current"
                                : "text-slate-200 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.95z" />
                          </svg>
                        ))}
                      </div>
                      <span className="text-xs font-bold text-slate-800">
                        {gig.freelancer?.rating?.average?.toFixed(1) ?? "—"}
                      </span>
                      <span className="text-xs text-slate-400">
                        ({gig.freelancer?.rating?.count ?? 0})
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-slate-600 group-hover:text-indigo-600 transition-colors flex items-center gap-0.5">
                      View details
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-100 max-w-md mx-auto">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <h3 className="text-base font-bold text-slate-800">
              No services found
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your search criteria or clearing filters.
            </p>
            <button
              onClick={() => setFilters(emptyFilters)}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors"
            >
              Clear All Filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default ProjectComponent;