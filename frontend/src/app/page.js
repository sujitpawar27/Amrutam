"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DoctorCard from "@/components/DoctorCard";
import SearchFilters from "@/components/SearchFilters";
import { Button } from "@/components/ui/button";
import { LogOut, Users, LogIn } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { fetchDoctors } from "@/lib/doctor";
import { checkAuth, logout } from "@/lib/auth";

export default function Home() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    specialization: "all",
    mode: "all",
  });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  const refreshAuthStatus = async () => {
    const res = await checkAuth();
    setIsLoggedIn(res.authenticated);
  };

  useEffect(() => {
    refreshAuthStatus();
  }, []);

  const handleLogout = async () => {
    try {
      const res = await logout(); // call API

      // Check server response
      if (res.data?.message === "Logged out" && res.status == 200) {
        setIsLoggedIn(false);
        router.push("/");
      } else {
        console.error("Unexpected logout response:", res);
      }
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const handleDoctorClick = async (doctorId) => {
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    router.push(`/doctor/${doctorId}`);
  };

  useEffect(() => {
    const getDoctors = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctors(filters);
        setDoctors(data);
      } catch (error) {
        console.error("Error fetching doctors:", error);
        setDoctors([]);
      } finally {
        setLoading(false);
      }
    };

    getDoctors();
  }, [filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Find Your Doctor
              </h1>
              <p className="text-sm text-gray-600">
                Book appointments with trusted healthcare professionals
              </p>
            </div>
          </div>

          {/* Login / Logout Button */}
          {isLoggedIn ? (
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2 border-gray-300"
            >
              <LogOut className="w-4 h-4" /> Logout
            </Button>
          ) : (
            <Button
              variant="outline"
              onClick={() => router.push("/login")}
              className="flex items-center gap-2 border-gray-300"
            >
              <LogIn className="w-4 h-4" /> Login
            </Button>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <SearchFilters onChange={setFilters} />
        </div>

        {/* Doctors Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse bg-gray-100 h-80">
                <CardContent className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {doctors.map((doc) => (
              <div
                key={doc._id}
                onClick={() => handleDoctorClick(doc._id)}
                className="cursor-pointer"
              >
                <DoctorCard doctor={doc} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search criteria or filters.
            </p>
            <Button
              onClick={() =>
                setFilters({
                  searchTerm: "",
                  specialization: "all",
                  mode: "all",
                })
              }
              variant="outline"
              className="border-gray-300"
            >
              Clear Filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
