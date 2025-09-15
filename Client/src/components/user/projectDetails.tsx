import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import { getProjectDetails } from "@/api/client.api"
import { ProjectDetail, FreelancerDetail } from "@/types/user.type"


function ProjectDetails() {
  const { projectId } = useParams()
  const [gig, setGig] = useState<ProjectDetail | null>(null)
  const [freelancer, setFreelancer] = useState<FreelancerDetail | null>(null)

  useEffect(() => {
    const projectFullDetail = async () => {
      const response = await getProjectDetails(projectId as string)
      console.log("Project Full Details : ",response)
      setGig(response.data.projectDetails.gig)
      setFreelancer(response.data.projectDetails.freelancer)
    }
    projectFullDetail()
  }, [projectId])

  if (!gig || !freelancer) {
    return <p className="text-center mt-10 text-lg text-gray-600">Loading gig details...</p>
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-10">
      {/* Gig Title & Description */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{gig.title}</h1>
        <p className="text-gray-600">{gig.description}</p>
      </div>

      {/* Gig Content */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left - Gallery */}
        <div>
          <img
            src={gig.gallery[0]}
            alt={gig.title}
            className="w-full h-72 object-cover rounded-xl shadow-md"
          />
          <div className="flex gap-3 mt-3">
            {gig.gallery.slice(1).map((img, index) => (
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
          <h2 className="text-xl font-semibold mb-4">Gig Information</h2>
          <p><span className="font-medium">Category:</span> {gig.category}</p>
          <p><span className="font-medium">Delivery Time:</span> {gig.deliveryTime} days</p>
          <p><span className="font-medium">Active:</span> {gig.isActive ? "Yes ✅" : "No ❌"}</p>

          {/* Pricing Plans */}
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-3">Pricing Plans</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-semibold">Basic</p>
                <p className="text-green-600">₹{gig.price.basic}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-semibold">Standard</p>
                <p className="text-green-600">₹{gig.price.standard}</p>
              </div>
              <div className="bg-gray-100 p-4 rounded-lg text-center">
                <p className="font-semibold">Premium</p>
                <p className="text-green-600">₹{gig.price.premium}</p>
              </div>
            </div>
          </div>

          <button className="mt-6 w-full bg-blue-600 text-white py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition">
            Continue ({gig.deliveryTime} days delivery)
          </button>
        </div>
      </div>

      {/* Freelancer Profile Section */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-bold mb-4">About the Freelancer</h2>
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
