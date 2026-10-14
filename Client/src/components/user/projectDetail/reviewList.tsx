export default function ReviewList({ reviews }: { reviews: any[] }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6">
      <h2 className="text-xl font-bold text-slate-900 border-b border-slate-100 pb-4">
        Client Reviews{" "}
        <span className="text-indigo-600 text-sm font-semibold">({reviews.length})</span>
      </h2>

      {reviews.length === 0 ? (
        <div className="py-8 text-center text-slate-400 text-sm">
          No reviews yet. Be the first client to review this freelancer!
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => {
            const name = review.client?.name || "Anonymous Client";
            return (
              <div key={review._id} className="bg-slate-50/50 rounded-xl border border-slate-100 p-5 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center font-bold text-sm">
                      {name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{name}</h4>
                      <p className="text-xs text-slate-400">
                        {new Date(review.givenAt || review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric", month: "short", day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex text-amber-400 text-sm">
                    {[...Array(5)].map((_, i) => (
                      <span key={i}>{i < (review.rating || 0) ? "★" : "☆"}</span>
                    ))}
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed italic">
                  "{review.clientFeedback?.feedback || "No detailed review left."}"
                </p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}