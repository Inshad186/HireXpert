import { FreelancerDetail } from "@/types/user.type";
// import StarRating from "@/components/user/common/StarRating";

interface Props {
  freelancer: FreelancerDetail;
  profileImage?: string;
}

export default function FreelancerSummary({ freelancer, profileImage }: Props) {
  const rating = freelancer.rating;

  const details = [
    ["Qualification", freelancer.qualification],
    ["Experience", freelancer.work_experience],
    ["Working Days", freelancer.working_days],
    ["Active Hours", freelancer.active_hours],
    ["Languages", freelancer.proficient_languages?.join(", ")],
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-900 tracking-tight">About the Freelancer</h2>

      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
        <img
          src={profileImage || "/placeholder-avatar.jpg"}
          alt={freelancer.name}
          className="w-20 h-20 rounded-full object-cover border-2 border-indigo-100 shadow-sm flex-shrink-0"
        />
        <div className="text-center sm:text-left space-y-1">
          <h3 className="text-lg font-bold text-slate-900 capitalize">{freelancer.name}</h3>
          <p className="text-sm font-medium text-indigo-600">
            {freelancer.profession} {freelancer.company ? `@ ${freelancer.company}` : ""}
          </p>
          <div className="flex items-center justify-center sm:justify-start gap-1.5 pt-1">
            {/* <StarRating value={rating?.average ?? 0} /> */}
            <span className="text-xs font-bold text-slate-800">
              {rating?.average?.toFixed(1) ?? "—"}
            </span>
            <span className="text-xs text-slate-400">({rating?.count ?? 0})</span>
          </div>
        </div>
      </div>

      <p className="text-md text-slate-600 leading-relaxed">{freelancer.bio}</p>

      <div className="grid sm:grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-sm text-slate-600">
        {details.map(([label, value]) => (
          <p key={label}>
            <strong className="text-slate-800">{label}:</strong> {value}
          </p>
        ))}
        {freelancer.portfolio && (
          <p>
            <strong className="text-slate-800">Portfolio:</strong>{" "}
            <a href={freelancer.portfolio} target="_blank" rel="noreferrer" className="text-indigo-600 font-semibold hover:underline">
              View Portfolio
            </a>
          </p>
        )}
      </div>
    </div>
  );
}