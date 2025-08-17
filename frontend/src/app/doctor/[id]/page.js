"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Star,
  User,
  Phone,
  Mail,
  Stethoscope,
  GraduationCap,
  X,
  Edit,
  Filter,
  CalendarDays,
  History,
} from "lucide-react";
import { fetchDoctorById } from "@/lib/doctor";
import {
  getUserAppointments,
  cancelAppointmentById,
  cancelAppointment,
} from "@/lib/appointment";
import { checkAuth } from "@/lib/auth";
import BookAppointmentModal from "@/components/BookAppointmentModal";

export default function DoctorDetails() {
  const { id: doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefillData, setPrefillData] = useState(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("upcoming");
  const [user, setUser] = useState(null);

  // Check authentication on component mount
  useEffect(() => {
    const checkUserAuth = async () => {
      const authResult = await checkAuth();
      if (authResult.authenticated) {
        setUser(authResult.user);
      }
    };
    checkUserAuth();
  }, []);

  // Fetch doctor details
  useEffect(() => {
    const getDoctor = async () => {
      setLoading(true);
      try {
        const data = await fetchDoctorById(doctorId);
        setDoctor(data);
      } catch (error) {
        console.error("Error fetching doctor:", error);
      } finally {
        setLoading(false);
      }
    };
    getDoctor();
  }, [doctorId]);

  // Load appointments
  const loadAppointments = async () => {
    try {
      const all = await getUserAppointments(doctorId);

      const arr = Array.isArray(all)
        ? all
        : Array.isArray(all.appointments)
        ? all.appointments
        : [];

      const filtered = arr.filter(
        (a) => String(a.doctorId) === String(doctorId)
      );

      setAppointments(filtered);
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setAppointments([]);
    }
  };

  useEffect(() => {
    if (doctorId) loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [doctorId]);

  const handleReschedule = (appointment) => {
    setPrefillData(appointment);
    setShowModal(true);
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointment(appointmentId);
      await loadAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Booked":
        return "bg-green-100 text-green-800 border-green-200";
      case "Cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Filter appointments based on tab and status
  const filterAppointments = (appointments, tabType) => {
    const now = new Date();
    let filtered = [...appointments];

    // Filter by time based on active tab
    if (tabType === "upcoming") {
      filtered = filtered.filter(
        (appointment) => new Date(appointment.slotTime) >= now
      );
    } else if (tabType === "past") {
      filtered = filtered.filter(
        (appointment) => new Date(appointment.slotTime) < now
      );
    }

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(
        (appointment) => appointment.status.toLowerCase() === statusFilter
      );
    }

    // Sort by date (upcoming first for upcoming, recent first for past)
    filtered.sort((a, b) => {
      const dateA = new Date(a.slotTime);
      const dateB = new Date(b.slotTime);

      if (tabType === "past") {
        return dateB - dateA; // Most recent first for past appointments
      }
      return dateA - dateB; // Soonest first for upcoming appointments
    });

    return filtered;
  };

  const getFilteredAppointments = (tabType) => {
    return filterAppointments(appointments, tabType);
  };

  const getUpcomingCount = () => {
    const now = new Date();
    return appointments.filter(
      (appointment) =>
        new Date(appointment.slotTime) >= now &&
        appointment.status !== "Cancelled"
    ).length;
  };

  const getPastCount = () => {
    const now = new Date();
    return appointments.filter(
      (appointment) => new Date(appointment.slotTime) < now
    ).length;
  };

  const getStatusCount = (status) => {
    return appointments.filter(
      (appointment) => appointment.status.toLowerCase() === status
    ).length;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
              <div className="flex items-start space-x-4">
                <div className="h-24 w-24 rounded-full bg-white/30 animate-pulse" />
                <div className="flex-1 space-y-3">
                  <div className="h-6 w-40 bg-white/30 rounded animate-pulse" />
                  <div className="h-4 w-32 bg-white/20 rounded animate-pulse" />
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-6">
              <div className="h-5 w-1/3 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse" />
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
                <div className="h-10 bg-gray-200 rounded animate-pulse" />
              </div>
              <div className="h-12 bg-gray-200 rounded animate-pulse w-full" />
            </CardContent>
          </Card>

          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b p-6">
              <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent className="p-6 space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg animate-pulse"
                >
                  <div className="flex items-center space-x-4">
                    <div className="h-10 w-10 bg-gray-200 rounded-full" />
                    <div className="space-y-2">
                      <div className="h-4 w-40 bg-gray-200 rounded" />
                      <div className="h-4 w-24 bg-gray-200 rounded" />
                    </div>
                  </div>
                  <div className="h-8 w-20 bg-gray-200 rounded" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!doctor && !loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto shadow-xl">
          <CardContent className="p-8 text-center">
            <User className="h-16 w-16 mx-auto text-gray-400 mb-4" />
            <p className="text-xl font-semibold text-gray-800 mb-2">
              Doctor Not Found
            </p>
            <p className="text-gray-600">
              The requested doctor profile could not be located.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const filteredUpcomingAppointments = getFilteredAppointments("upcoming");
  const filteredPastAppointments = getFilteredAppointments("past");

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Doctor Profile Card */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
              <div className="absolute inset-0 bg-black/10"></div>
              <div className="relative flex items-start space-x-4">
                <Avatar className="h-24 w-24 border-4 border-white shadow-xl">
                  <AvatarImage src={doctor.avatar} alt={doctor.name} />
                  <AvatarFallback className="bg-white text-blue-600 text-2xl font-bold">
                    {doctor.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-3xl font-bold mb-2 text-white">
                    {doctor.name}
                  </CardTitle>
                  <div className="flex items-center space-x-2 mb-3">
                    <Stethoscope className="h-5 w-5" />
                    <CardDescription className="text-blue-100 text-lg">
                      {doctor.specialization}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-blue-100">
                    {/* <div className="flex items-center space-x-1">
                      <GraduationCap className="h-4 w-4" />
                      <span>{doctor.experience} years experience</span>
                    </div> */}
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>
                        {Array.isArray(doctor.mode)
                          ? doctor.mode.join(" / ")
                          : doctor.mode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                {/* Rating and Quick Stats */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < (doctor.rating || 0)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600">
                      {doctor.rating || ""} ({doctor.reviews || "No"} reviews)
                    </span>
                  </div>
                  <Badge variant="secondary" className="px-3 py-1">
                    Available Today
                  </Badge>
                </div>

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-3">
                    About
                  </h3>
                  <p className="text-gray-700 leading-relaxed">{doctor.bio}</p>
                </div>

                <Separator className="my-6" />

                {/* Contact Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">
                      {doctor.phone || "Not available"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <span className="text-gray-700">
                      {doctor.email || "Not available"}
                    </span>
                  </div>
                </div>

                {/* Book Appointment Button */}
                <Button
                  onClick={() => {
                    setPrefillData(null);
                    setTimeout(() => setShowModal(true), 0);
                  }}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Calendar className="mr-2 h-5 w-5" />
                  Book New Appointment
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Appointments Section */}
          <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b pb-4 p-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <CardTitle className="text-2xl font-bold text-gray-800 flex items-center">
                    <Calendar className="mr-2 h-6 w-6 text-blue-600" />
                    Your Appointments
                  </CardTitle>
                  <CardDescription className="text-gray-600 mt-1">
                    Manage your appointments with {doctor.name}
                  </CardDescription>
                  <p className="text-sm text-red-600 mt-1 italic font-semibold">
                    ⚠️ Rescheduling/Cancellation is allowed only if the
                    appointment is more than 24 hours away.
                  </p>
                </div>

                {/* Status Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="h-4 w-4 text-gray-500" />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-36">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="booked">
                        Booked ({getStatusCount("booked")})
                      </SelectItem>
                      <SelectItem value="completed">
                        Completed ({getStatusCount("completed")})
                      </SelectItem>
                      <SelectItem value="cancelled">
                        Cancelled ({getStatusCount("cancelled")})
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Modernized Compact Tabs */}
              <div className="mt-4">
                <Tabs
                  value={activeTab}
                  onValueChange={setActiveTab}
                  className="w-full"
                >
                  <TabsList className="inline-flex h-9 items-center justify-center rounded-lg bg-gray-100/80 p-1 text-gray-500 shadow-sm">
                    <TabsTrigger
                      value="upcoming"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-blue-600 data-[state=active]:shadow-sm"
                    >
                      <CalendarDays className="h-3.5 w-3.5 mr-1.5" />
                      Upcoming ({getUpcomingCount()})
                    </TabsTrigger>
                    <TabsTrigger
                      value="past"
                      className="inline-flex items-center justify-center whitespace-nowrap rounded-md px-4 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-white data-[state=active]:text-gray-700 data-[state=active]:shadow-sm"
                    >
                      <History className="h-3.5 w-3.5 mr-1.5" />
                      Past ({getPastCount()})
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              <Tabs
                value={activeTab}
                onValueChange={setActiveTab}
                className="w-full"
              >
                <TabsContent value="upcoming" className="mt-0">
                  {filteredUpcomingAppointments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {filteredUpcomingAppointments.map((appointment) => {
                        const appointmentDate = new Date(appointment.slotTime);

                        return (
                          <div
                            key={appointment._id}
                            className="p-6 hover:bg-blue-50/50 transition-colors duration-150 bg-blue-50/20"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-full bg-blue-100">
                                  <CalendarDays className="h-5 w-5 text-blue-600" />
                                </div>

                                <div>
                                  <div className="flex items-center space-x-3 mb-1">
                                    <span className="font-semibold text-gray-800 text-lg">
                                      {appointmentDate.toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>
                                    <Badge
                                      className={`text-xs ${getStatusColor(
                                        appointment.status
                                      )}`}
                                    >
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {appointmentDate.toLocaleTimeString(
                                          "en-US",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                      </span>
                                    </div>
                                    {appointment.notes && (
                                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                        Note: {appointment.notes}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              {appointment.status !== "Cancelled" && (
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleReschedule(appointment)
                                    }
                                    className="text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                  >
                                    <Edit className="mr-1 h-3 w-3" />
                                    Reschedule
                                  </Button>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      handleCancel(appointment._id)
                                    }
                                    className="text-red-600 border-red-200 hover:bg-red-50 hover:border-red-300"
                                  >
                                    <X className="mr-1 h-3 w-3" />
                                    Cancel
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <CalendarDays className="h-20 w-20 mx-auto text-blue-300 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No upcoming appointments
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {statusFilter !== "all"
                          ? "No upcoming appointments match the selected status filter."
                          : "You don't have any upcoming appointments with this doctor."}
                      </p>
                      {statusFilter !== "all" && (
                        <Button
                          variant="outline"
                          onClick={() => setStatusFilter("all")}
                          className="mb-4"
                        >
                          Clear Status Filter
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="past" className="mt-0">
                  {filteredPastAppointments.length > 0 ? (
                    <div className="divide-y divide-gray-100">
                      {filteredPastAppointments.map((appointment) => {
                        const appointmentDate = new Date(appointment.slotTime);

                        return (
                          <div
                            key={appointment._id}
                            className="p-6 hover:bg-gray-50 transition-colors duration-150 bg-gray-50/30"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                <div className="p-3 rounded-full bg-gray-100">
                                  <History className="h-5 w-5 text-gray-600" />
                                </div>

                                <div>
                                  <div className="flex items-center space-x-3 mb-1">
                                    <span className="font-semibold text-gray-800 text-lg">
                                      {appointmentDate.toLocaleDateString(
                                        "en-US",
                                        {
                                          weekday: "long",
                                          year: "numeric",
                                          month: "long",
                                          day: "numeric",
                                        }
                                      )}
                                    </span>
                                    <Badge
                                      className={`text-xs ${getStatusColor(
                                        appointment.status
                                      )}`}
                                    >
                                      {appointment.status}
                                    </Badge>
                                  </div>
                                  <div className="flex items-center space-x-3 text-sm text-gray-600">
                                    <div className="flex items-center space-x-1">
                                      <Clock className="h-4 w-4" />
                                      <span>
                                        {appointmentDate.toLocaleTimeString(
                                          "en-US",
                                          {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          }
                                        )}
                                      </span>
                                    </div>
                                    {appointment.notes && (
                                      <span className="px-2 py-1 bg-gray-100 rounded text-xs">
                                        Note: {appointment.notes}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="p-12 text-center">
                      <History className="h-20 w-20 mx-auto text-gray-300 mb-6" />
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">
                        No past appointments
                      </h3>
                      <p className="text-gray-600 mb-6">
                        {statusFilter !== "all"
                          ? "No past appointments match the selected status filter."
                          : "You don't have any past appointments with this doctor."}
                      </p>
                      {statusFilter !== "all" && (
                        <Button
                          variant="outline"
                          onClick={() => setStatusFilter("all")}
                          className="mb-4"
                        >
                          Clear Status Filter
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Appointment Modal */}
      {showModal && (
        <BookAppointmentModal
          doctor={doctor}
          prefillData={prefillData}
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false);
            setPrefillData(null);
            loadAppointments();
          }}
        />
      )}
    </div>
  );
}
