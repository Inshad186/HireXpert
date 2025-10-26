import { getProjects } from "@/api/client.api";
import React, { useState, useEffect } from "react";
import { InitialProjectDetail } from "@/types/user.type";
import { Link } from "react-router-dom";
import { userRoutes } from "@/constants/routeUrl";

function ProjectComponent() {
  const [gigs, setGigs] = useState<InitialProjectDetail[]>([]);

  useEffect(() => {
    const fetchGigs = async () => {
      const response = await getProjects();
      console.log("Get Projects : ", response);
      if (response.success) {
        setGigs(response.data.gigs);
      }
    };

    fetchGigs();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Freelancer Services
        </h1>
        <p className="text-gray-500 mt-2 text-lg">
          Find skilled professionals to match your project needs
        </p>
      </div>

      <section className="px-6 md:px-24 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center md:text-left">
          <span className="border-b-4 border-indigo-500 pb-1">Top Freelancer Services</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {gigs.map((gig) => (
            <Link to={`${userRoutes.PROJECT_DETAILS}/${gig._id}`} key={gig._id}>
            <div
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
            >
              {/* Thumbnail Image */}
              <img
                src={gig.gallery && gig.gallery.length > 0 ? gig.gallery[0] : "/placeholder.jpg"}
                alt={gig.title}
                className="w-full h-48 object-cover rounded-t-2xl"
              />

              <div className="p-6">
                {/* Title */}
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {gig.title}
                </h3>

                {/* Short Description */}
                <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                  {gig.pricing?.basic.description}
                </p>

                {/* Price */}
                <div className="mt-4">
                  <span className="text-xl font-bold text-indigo-600">
                    ${gig.pricing?.basic.price}
                  </span>
                  <span className="text-gray-500 text-sm ml-1">starting</span>
                </div>
              </div>
            </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ProjectComponent;
