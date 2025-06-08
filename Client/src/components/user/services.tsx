import { getFreelancer } from "@/api/user.api";
import React, { useState, useEffect } from "react";

function ServicesComponent() {
  const [freelancers, setFreelancers] = useState<{
    name: string;
    email: string;
    profession: string;
    work_experience: string;
    working_days: string;
    active_hours: string;
    profilePicture: string;
  }[]>([]);

  useEffect(() => {
    const fetchFreelancers = async () => {
      try {
        const response = await getFreelancer();
        if (response.success) {
          setFreelancers(response.data.data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchFreelancers();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="text-center py-12">
        <h1 className="text-4xl font-extrabold text-gray-800 tracking-wide">
          Freelancer Services
        </h1>
        <p className="text-gray-500 mt-2 text-lg">Find skilled professionals to match your project needs</p>
      </div>

      <section className="px-6 md:px-24 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-10 text-center md:text-left">
          <span className="border-b-4 border-indigo-500 pb-1">Top Freelancers</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-screen-xl mx-auto">
          {freelancers.map((freelancer, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition duration-300 overflow-hidden"
            >
              <img
                src={freelancer.profilePicture}
                alt={freelancer.name}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900">{freelancer.name}</h3>
                <p className="text-indigo-600 font-medium mb-4">{freelancer.profession}</p>

                <div className="space-y-2">
                  <div className="text-sm text-gray-700 bg-slate-200 rounded-lg px-3 py-1 ">
                    <strong>Experience:</strong> {freelancer.work_experience}
                  </div>
                  <div className="text-sm text-gray-700 bg-slate-200 rounded-lg px-3 py-1 ">
                    <strong>Working Days:</strong> {freelancer.working_days}
                  </div>
                  <div className="text-sm text-gray-700 bg-slate-200 rounded-lg px-3 py-1 ">
                    <strong>Active Hours:</strong> {freelancer.active_hours}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default ServicesComponent;
