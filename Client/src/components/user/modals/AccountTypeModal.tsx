type AccountType = "individual" | "company";

interface Props {
  isOpen: boolean;
  loading: boolean;
  onSelect: (type: AccountType) => void;
}

const OPTIONS: { type: AccountType; icon: string; title: string; desc: string }[] = [
  { type: "individual", icon: "👤", title: "Individual", desc: "I am hiring for myself or a personal project" },
  { type: "company", icon: "🏢", title: "Company", desc: "I am hiring for a business or a team" },
];

export default function AccountTypeModal({ isOpen, loading, onSelect }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
        <h2 className="text-2xl font-bold text-slate-900 text-center">What type of client are you?</h2>
        <p className="text-sm text-slate-500 text-center mt-1 mb-6">
          This helps us set up the right profile for you.
        </p>

        <div className="grid grid-cols-2 gap-4">
          {OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              disabled={loading}
              onClick={() => onSelect(opt.type)}
              className="p-5 rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 disabled:opacity-50 transition text-center"
            >
              <div className="text-4xl mb-2">{opt.icon}</div>
              <p className="font-bold text-slate-900">{opt.title}</p>
              <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}