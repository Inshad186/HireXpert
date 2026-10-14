import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectDetails } from "@/api/client.api";
import { userRoutes } from "@/constants/routeUrl";
import Footer from "@/components/user/common/Footer";
import ProjectHeader from "@/components/user/projectDetail/projectHeader";
import ProjectGallery from "@/components/user/projectDetail/projectGallery";
import FreelancerSummary from "@/components/user/projectDetail/freelancerSummay";
import PricingCard, {PlanName} from "@/components/user/projectDetail/pricingCard"; 
import ReviewList from "@/components/user/projectDetail/reviewList";

function ProjectDetail() {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [details, setDetails] = useState<any | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanName>("basic");

  useEffect(() => {
    let ignore = false;
    const load = async () => {
      const response = await getProjectDetails(projectId as string);
      if (!ignore && response?.data?.projectDetails) {
        setDetails(response.data.projectDetails);
      }
    };
    load();
    return () => { ignore = true; };
  }, [projectId]);

  if (!details) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-slate-500 text-sm font-medium">Loading gig details...</p>
      </div>
    );
  }

  const { gig, freelancer, profileImage, freelancerReviews = [] } = details;

  return (
    <div>
      <div className="bg-slate-50/50 min-h-screen py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto space-y-10">
          <ProjectHeader gig={gig} />

          <div className="grid lg:grid-cols-12 gap-8 items-start">
            <div className="lg:col-span-7 space-y-4">
              <ProjectGallery images={gig.gallery} title={gig.title} />
              <FreelancerSummary freelancer={freelancer} profileImage={profileImage} />
            </div>

            <div className="lg:col-span-5 sticky top-6">
              <PricingCard
                pricing={gig.pricing}
                selectedPlan={selectedPlan}
                onSelectPlan={setSelectedPlan}
                onContinue={() =>
                  navigate(`${userRoutes.ORDER_CHECKOUT}/${projectId}`, {
                    state: { selectedPlan },
                  })
                }
              />
            </div>
          </div>

          <ReviewList reviews={freelancerReviews} />
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default ProjectDetail;