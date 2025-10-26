import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getProjectDetails } from "@/api/client.api"
import { ProjectDetail, FreelancerDetail } from "@/types/user.type"
import { useNavigate } from "react-router-dom"
import { userRoutes } from "@/constants/routeUrl"


function ProjectDetails() {
  const { projectId } = useParams()
  const [project, setProject] = useState<any | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null)
  const [profileImg, setProfileImg] = useState("")
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "standard" | "premium">("basic");

  const navigate = useNavigate()

  useEffect(() => {
    const projectFullDetail = async () => {
      const response = await getProjectDetails(projectId as string)

      console.log("Project Full Details : ",response.data)
      setProject(response.data.projectDetails.gig)
      setFreelancer(response.data.projectDetails.freelancer)
      setProfileImg(response.data.projectDetails.profileImage)
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

  const hello = () => {
    navigate(`${userRoutes.TESTING_ROUTE}/${projectId}`)
  }


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
          <p><span className="font-medium">Category:</span> {project.category}</p>
          <p><span className="font-medium">Delivery Time:</span> {project.pricing[selectedPlan].deliveryTime} days</p>
          <p><span className="font-medium">Active:</span> {project.isActive ? "Yes ✅" : "No ❌"}</p>

          {/* Pricing Plans */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pricing Plans</h3>

            {/* Plan Selection Buttons */}
            <div className="flex gap-4 mb-4">
              {["basic", "standard", "premium"].map((plan) => (
                <button
                  key={plan}
                  onClick={() => handlePlanSelect(plan as "basic" | "standard" | "premium")}
                  className={`px-4 py-2 rounded-lg border font-semibold capitalize transition ${
                    selectedPlan === plan
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  {plan}
                </button>
              ))}
            </div>

            {/* Selected Plan Details */}
            <div className="bg-gray-100 p-6 rounded-lg shadow-inner">
              <p className="text-xl font-semibold capitalize mb-2">{selectedPlan} Plan</p>
              <p className="text-green-600 text-lg font-medium">
                ₹{project.pricing[selectedPlan].price}
              </p>
              <p className="text-gray-700 mt-2">
                {project.pricing[selectedPlan].description}
              </p>
              <p className="text-gray-700 mt-2">
                Delivery Time: {project.pricing[selectedPlan].deliveryTime} days
              </p>
            </div>
          </div>

          <button 
          onClick={handleNavigate}
          className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
            Continue ({project.pricing[selectedPlan].deliveryTime} days delivery)
          </button>
        </div>
      </div>

      <div>
        <button 
        onClick={hello}
        className="text-center bg-blue-600 text-white p-2 rounded w-full">Click Me</button>
      </div>

      {/* Freelancer Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">About the Freelancer</h2>
        <img src={profileImg} alt={freelancer.name} className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md mx-auto" />
        <p className="text-lg font-semibold text-gray-800">{freelancer.name}</p>
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
