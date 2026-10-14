import { useState, useEffect } from "react";
import { getGigList, updateGigStatus } from "@/api/freelancer.api";
import { ProjectDetail } from "@/types/user.type";
import SimpleNavbar from "@/components/user/simpleNavbar";
import ListedGigsComp from "@/components/user/freelancer/listedGigsComp";

function ListedGig() {
  const [list, setList] = useState<ProjectDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ PAGE fetches data on mount
  useEffect(() => {
    const fetchGigList = async () => {
      try {
        setLoading(true);
        const response = await getGigList();
        if (response.success) {
          setList(response.data.gigDetails);
        } else {
          setError("Failed to fetch gigs");
        }
      } catch (err) {
        setError("An error occurred while fetching gigs");
        console.error("Error fetching gigs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGigList();
  }, []);

  // ✅ PAGE handles data mutations
  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const response = await updateGigStatus(id, !currentStatus);
      if (response.success) {
        setList((prev) =>
          prev.map((gig) =>
            gig._id === id ? { ...gig, isActive: !currentStatus } : gig
          )
        );
      }
    } catch (error) {
      console.error("Error updating gig status:", error);
    }
  };

  return (
    <div>
      <SimpleNavbar />
      <ListedGigsComp 
        list={list}
        loading={loading}
        error={error}
        onToggle={handleToggle}
      />
    </div>
  );
}

export default ListedGig;