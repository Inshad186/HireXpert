export type PlanName = "basic" | "standard" | "premium";
const PLANS: PlanName[] = ["basic", "standard", "premium"];

interface Props {
  pricing: Partial<Record<PlanName, { price: number; description: string; deliveryTime: number }>>;
  selectedPlan: PlanName;
  onSelectPlan: (plan: PlanName) => void;
  onContinue: () => void;
}

export default function PricingCard({ pricing, selectedPlan, onSelectPlan, onContinue }: Props) {
  const current = pricing?.[selectedPlan];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xl shadow-slate-200/50 space-y-6">
      <div>
        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Select Plan</h3>
        <div className="grid grid-cols-3 gap-1 bg-slate-100 p-1 rounded-xl">
          {PLANS.map((plan) => (
            <button
              key={plan}
              onClick={() => onSelectPlan(plan)}
              disabled={!pricing?.[plan]}
              className={`py-2 px-3 text-md font-bold rounded-lg capitalize transition-colors ${
                !pricing?.[plan]
                  ? "text-slate-400 cursor-not-allowed opacity-50"
                  : selectedPlan === plan
                  ? "bg-white text-indigo-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              {plan}
            </button>
          ))}
        </div>
      </div>

      {current ? (
        <div className="space-y-4">
          <div className="flex items-baseline justify-between border-b border-slate-100 pb-4">
            <div>
              <h4 className="text-lg font-bold text-slate-900 capitalize">{selectedPlan} Package</h4>
              <p className="text-sm text-slate-500 mt-0.5">Delivery in {current.deliveryTime} days</p>
            </div>
            <span className="text-3xl font-extrabold text-indigo-600">${current.price}</span>
          </div>

          <p className="text-md text-slate-600 leading-relaxed">{current.description}</p>

          <button
            onClick={onContinue}
            className="w-full py-3.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl shadow-md shadow-indigo-200 transition-colors"
          >
            Continue (${current.price})
          </button>
        </div>
      ) : (
        <div className="py-8 text-center text-slate-400 text-sm">
          This plan is currently unavailable for this project.
        </div>
      )}
    </div>
  );
}