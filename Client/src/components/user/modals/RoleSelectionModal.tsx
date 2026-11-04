
import { Role } from "@/types/user.type";

interface Props {
  isOpen: boolean;
  selectedRole: Role;
  loading: boolean;
  userName: string;
  onSelect: (role: Role) => void;
  onContinue: () => void;
}

export default function RoleSelectionModal({
  isOpen,
  selectedRole,
  loading,
  userName,
  onSelect,
  onContinue,
}: Props) {
  if (!isOpen) return null;

  const options: {
    role: Role;
    title: string;
    description: string;
  }[] = [
    {
      role: "client",
      title: "I'm a Client",
      description: "Looking to hire talent and manage projects",
    },
    {
      role: "freelancer",
      title: "I'm a Freelancer",
      description: "Looking to offer services and complete gigs",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg space-y-6 rounded-2xl border border-slate-100 bg-white p-6 shadow-2xl sm:p-8">
        <div className="space-y-1 text-center">
          <h2 className="text-2xl font-extrabold text-slate-900">
            Welcome, {userName}!
          </h2>

          <p className="text-xs text-slate-500 sm:text-sm">
            Select your primary role to customize your experience.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {options.map((option) => (
            <button
              key={option.role}
              type="button"
              disabled={loading}
              onClick={() => onSelect(option.role)}
              className={`rounded-xl border p-5 text-left transition-colors ${
                selectedRole === option.role
                  ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              }`}
            >
              <div className="text-sm font-bold text-slate-900">
                {option.title}
              </div>

              <p className="mt-1 text-xs text-slate-500">
                {option.description}
              </p>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onContinue}
          disabled={!selectedRole || loading}
          className="w-full rounded-xl bg-indigo-600 px-4 py-3 text-sm font-semibold text-white shadow-md transition-colors hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? "Saving..." : "Continue"}
        </button>
      </div>
    </div>
  );
}
