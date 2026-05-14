import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getFreelancerReviews, getProjectDetails } from "@/api/client.api"
import { ProjectDetail, FreelancerDetail } from "@/types/user.type"
import { useNavigate } from "react-router-dom"
import { userRoutes } from "@/constants/routeUrl"


function ProjectDetails() {
  const { projectId } = useParams()
  const [project, setProject] = useState<any | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null)
  const [profileImg, setProfileImg] = useState("")
  const [freelancerReviews, setFreelancerReviews] = useState<any[]>([])
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard" | "premium">("basic");

  const navigate = useNavigate()

  useEffect(() => {
    const projectFullDetail = async () => {
      const response = await getProjectDetails(projectId as string)
      console.log("Project Full Details : ",response.data.projectDetails)
      setProject(response.data.projectDetails.gig)
      setFreelancer(response.data.projectDetails.freelancer)
      setProfileImg(response.data.projectDetails.profileImage)
      setFreelancerReviews(response.data.projectDetails.freelancerReviews)
    }
    projectFullDetail()
  }, [projectId])

  if (!project || !freelancer) {
    return <p className="text-center mt-10 text-lg text-gray-600">Loading gig details...</p>
  }

  const handleNavigate = () =>{
    navigate(`${userRoutes.ORDER_CHECKOUT}/${projectId}`, {state : {selectedPlan}})
  }

  const handlePlanSelect = (plan: "basic" | "standard" | "premium") => {
  setSelectedPlan(plan);
};


  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Gig Title & Description */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-gray-600 text-xl">{project.pricing?.basic.description}</p>
      </div>

      {/* Gig Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Gallery */}
        <div>
          <img
            src={project.gallery[0]}
            alt={project.title}
            className="w-full h-72 object-cover rounded-xl shadow-md"
          />
          <div className="flex space-x-3 mt-3">
            {project.gallery.slice(1).map((img:any, index:any) => (
              <img
                key={index}
                src={img}
                alt={`Gallery ${index}`}
                className="w-28 h-20 object-cover rounded-lg border cursor-pointer hover:scale-105 transition"
              />
            ))}
          </div>
        </div>

        {/* Right - Gig Info */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Project Information</h2>
          <p><span className="font-medium">Category:</span> {project?.category}</p>
          <p><span className="font-medium">Delivery Time:</span> {project.pricing[selectedPlan]?.deliveryTime} days</p>
          <p><span className="font-medium">Active:</span> {project?.isActive ? "Yes ✅" : "No ❌"}</p>

          {/* Rating */}
          <div className="flex items-center gap-1.5 mt-5">
            <div className="flex">
              {[1,2,3,4,5].map(s => (
                <svg
                  key={s}
                  className={`w-6 h-6 ${s <= Math.round(freelancer?.rating?.average ?? 0) ? "text-amber-500 fill-current" : "text-gray-300"}`}
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.95 4.146.018c.958.004 1.355 1.226.584 1.818l-3.36 2.455 1.287 3.951c.3.922-.756 1.688-1.541 1.125L10 13.011l-3.353 2.333c-.785.563-1.841-.203-1.541-1.125l1.287-3.951-3.36-2.455c-.77-.592-.374-1.814.584-1.818l4.146-.018 1.286-3.95z" />
                </svg>
              ))}
            </div>
            <span className="font-semibold">{freelancer?.rating?.average?.toFixed(1) ?? "—"}</span>
            <span className="text-gray-500">({freelancer?.rating?.count})</span>
          </div>

          {/* Pricing Plans */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pricing Plans</h3>

            {/* Plan Selection Buttons */}
            <div className="flex gap-4 mb-4">
              {["basic", "standard", "premium"].map((plan) => (
              <button
                key={plan}
                onClick={() => handlePlanSelect(plan as "basic" | "standard" | "premium")}
                disabled={!project?.pricing[plan]}
                className={`px-4 py-2 rounded-lg border font-semibold capitalize transition ${
                  !project?.pricing[plan]
                    ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                    : selectedPlan === plan
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                }`}
              >
                {plan}
                {!project?.pricing[plan] && <span className="text-xs ml-1">(Coming soon)</span>}
              </button>
              ))}
            </div>

            {/* Selected Plan Details */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
              <p className="text-xl font-semibold capitalize mb-2">{selectedPlan} Plan</p>
              <p className="text-green-600 text-lg font-medium">
                ₹{project?.pricing[selectedPlan]?.price}
              </p>
              <p className="text-gray-700 mt-2">
                {project?.pricing[selectedPlan]?.description}
              </p>
              <p className="text-gray-700 mt-2">
                Delivery Time: {project?.pricing[selectedPlan]?.deliveryTime} days
              </p>
            </div>
          </div>

          <button 
          onClick={handleNavigate}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
            Continue ({project?.pricing[selectedPlan]?.deliveryTime} days delivery)
          </button>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="mt-10 max-w-4xl px-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Client Reviews ({freelancerReviews.length})
          </h2>
        <div className="space-y-10">
          {freelancerReviews.length > 0 ? (
            freelancerReviews.map((review) => (
              <div
                key={review._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-4">
                  {/* Client Avatar */}
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-gray-500 font-medium">
                    {review.client?.name?.charAt(0)?.toUpperCase() || "C"}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-gray-900">
                        {review.client?.name || "Anonymous Client"}
                      </h3>
                      
                      {/* Star Rating */}
                      <div className="flex items-center gap-1 text-amber-500">
                        {[...Array(5)].map((_, i) => (
                          <span key={i} className="text-lg">
                            {i < (review.rating || 0) ? "★" : "☆"}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Review Date */}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.givenAt || review.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>

                    {/* Feedback */}
                    <p className="mt-3 text-gray-700 leading-relaxed">
                      "{review.clientFeedback?.feedback || "No feedback provided."}"
                    </p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-2xl p-10 text-center text-gray-500">
              No reviews yet. Be the first to review this freelancer!
            </div>
          )}
        </div>
      </div>

      {/* Freelancer Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100">
        <h2 className="text-2xl font-bold mb-4">About the Freelancer</h2>
        <img src={profileImg} alt={freelancer.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
        <p className="text-lg font-semibold capitalize text-gray-800">{freelancer.name}</p>
        <p className="text-gray-600 mb-2">{freelancer.profession} @ {freelancer.company}</p>
        <p className="text-gray-700 mb-4">{freelancer.bio}</p>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <p><span className="font-medium">Qualification:</span> {freelancer.qualification}</p>
            <p><span className="font-medium">Experience:</span> {freelancer.work_experience}</p>
            <p><span className="font-medium">Working Days:</span> {freelancer.working_days}</p>
            <p><span className="font-medium">Active Hours:</span> {freelancer.active_hours}</p>
          </div>
          <div>
            <p><span className="font-medium">Languages:</span> {freelancer.proficient_languages.join(", ")}</p>
            {freelancer.portfolio && (
              <p>
                <span className="font-medium">Portfolio:</span>{" "}
                <a href={freelancer.portfolio} className="text-blue-600 underline">View</a>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProjectDetails
