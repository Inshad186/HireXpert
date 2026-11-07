import { Layers, DollarSign, Clock } from "lucide-react";

interface PricingPlan {
  price: number;
  description: string;
  deliveryTime: number;
}

interface Props {
  pricing: {
    basic: PricingPlan;
    standard: PricingPlan;
    premium: PricingPlan;
  };
  onPricingChange: (
    level: "basic" | "standard" | "premium",
    field: "price" | "description" | "deliveryTime",
    value: string
  ) => void;
}

function GigPricing({ pricing, onPricingChange }: Props) {
  return (
    <div className="space-y-4 pt-4 border-t border-slate-100">
      <div>
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          2. Pricing Tiers
        </h2>
        <p className="text-xs font-medium text-slate-500">
          Define your service packages (Basic is required, Standard & Premium
          are optional)
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {(["basic", "standard", "premium"] as const).map((level) => (
          <div
            key={level}
            className={`rounded-3xl border p-6 space-y-4 transition-all ${
              level === "basic"
                ? "bg-slate-50/60 border-indigo-200 shadow-sm"
                : "bg-white border-slate-200/80"
            }`}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900 flex items-center gap-1.5">
                <Layers size={16} className="text-indigo-600" />
                {level}
              </h3>

              {level === "basic" && (
                <span className="px-2.5 py-0.5 bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase rounded-full">
                  Required
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Price ($)
                </label>

                <div className="relative flex items-center">
                  <DollarSign
                    size={14}
                    className="absolute left-3 text-slate-400"
                  />
                  <input
                    type="number"
                    min={0}
                    value={pricing[level].price === 0 ? "" : pricing[level].price}
                    onChange={(e) =>
                      onPricingChange(level, "price", e.target.value)
                    }
                    placeholder="0.00"
                    className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-8 pr-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Description
                </label>

                <textarea
                  rows={3}
                  value={pricing[level].description}
                  onChange={(e) =>
                    onPricingChange(level, "description", e.target.value)
                  }
                  placeholder="What's included in this tier..."
                  className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 px-3 text-slate-800 text-xs font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                  Delivery Time (Days)
                </label>

                <div className="relative flex items-center">
                  <Clock
                    size={14}
                    className="absolute left-3 text-slate-400"
                  />
                  <input
                    type="number"
                    min={0}
                    value={
                      pricing[level].deliveryTime === 0
                        ? ""
                        : pricing[level].deliveryTime
                    }
                    onChange={(e) =>
                      onPricingChange(level, "deliveryTime", e.target.value)
                    }
                    placeholder="e.g. 3"
                    className="w-full bg-white border border-slate-200/80 rounded-2xl py-2.5 pl-8 pr-4 text-slate-800 text-sm font-medium focus:ring-2 focus:ring-indigo-600 focus:border-transparent outline-none transition-all shadow-xs"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GigPricing;