"use client";
import { useState, useEffect } from "react";
import DoctorCard from "@/components/DoctorCard";
import SearchFilters from "@/components/SearchFilters";
import { fetchDoctors } from "@/lib/doctor";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [filters, setFilters] = useState({ specialization: "", mode: "" });

  useEffect(() => {
    const getDoctors = async () => {
      try {
        const data = await fetchDoctors(filters);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      }
    };

    getDoctors();
  }, [filters]);

  return (
    <div className="p-6">
      <SearchFilters onChange={setFilters} />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
        {doctors.map((doc) => (
          <DoctorCard key={doc._id} doctor={doc} />
        ))}
      </div>
    </div>
  );
}
// "use client";
// import { useState, useEffect } from "react";
// import api from "@/lib/api";
// import DoctorCard from "@/components/DoctorCard";
// import SearchFilters from "@/components/SearchFilters";
// import { fetchDoctors } from "@/lib/doctor";

// const dummyDoctors = [
//   {
//     _id: "1",
//     name: "Dr. Asha Sharma",
//     specialization: "Cardiologist",
//     mode: "Online",
//     experience: 12,
//     // image: "https://via.placeholder.com/300x200?text=Dr.+Asha+Sharma",
//   },
//   {
//     _id: "2",
//     name: "Dr. Rohan Mehta",
//     specialization: "Dermatologist",
//     mode: "Offline",
//     experience: 8,
//     // image: "https://via.placeholder.com/300x200?text=Dr.+Rohan+Mehta",
//   },
//   {
//     _id: "3",
//     name: "Dr. Priya Nair",
//     specialization: "Neurologist",
//     mode: "Online",
//     experience: 15,
//     // image: "https://via.placeholder.com/300x200?text=Dr.+Priya+Nair",
//   },
// ];

// export default function Home() {
//   const [doctors, setDoctors] = useState(dummyDoctors);
//   const [filters, setFilters] = useState({ specialization: "", mode: "" });

//   useEffect(() => {
//     const getDoctors = async () => {
//       try {
//         const data = await fetchDoctors(filters);
//         setDoctors(data.length ? data : dummyDoctors);
//       } catch (error) {
//         console.error("Error fetching doctors:", error);
//         setDoctors(dummyDoctors);
//       }
//     };

//     getDoctors();
//   }, [filters]);

//   return (
//     <div className="p-6">
//       <SearchFilters onChange={setFilters} />
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
//         {doctors.map((doc) => (
//           <DoctorCard key={doc._id} doctor={doc} />
//         ))}
//       </div>
//     </div>
//   );
// }
