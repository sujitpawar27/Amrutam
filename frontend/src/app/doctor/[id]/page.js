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
import { fetchDoctorById } from "@/lib/doctor";
import { getUserAppointments, cancelAppointmentById } from "@/lib/appointment";
import BookAppointmentModal from "@/components/BookAppointmentModal";

export default function DoctorDetails() {
  const { id: doctorId } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [prefillData, setPrefillData] = useState(null);

  const userId = "689dbf9887b33ac0090d630a"; // Replace with real logged-in user ID

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
      const all = await getUserAppointments(userId, doctorId);
      const arr = Array.isArray(all)
        ? all
        : Array.isArray(all.appointments)
        ? all.appointments
        : [];

      const filtered = arr.filter(
        (a) => String(a.doctorId) === String(doctorId)
      );
      console.log("Filtered appointments:", filtered);

      setAppointments(filtered);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  useEffect(() => {
    if (userId && doctorId) loadAppointments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, doctorId]);

  const handleReschedule = (appointment) => {
    setPrefillData(appointment);
    setShowModal(true);
  };

  const handleCancel = async (appointmentId) => {
    try {
      await cancelAppointmentById(appointmentId);
      await loadAppointments();
    } catch (error) {
      console.error("Error cancelling appointment:", error);
    }
  };

  if (loading) return <p className="p-6">Loading...</p>;
  if (!doctor) return <p className="p-6 text-red-500">Doctor not found.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Doctor Info */}
      <Card className="shadow-lg border border-gray-200">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{doctor.name}</CardTitle>
          <CardDescription className="text-gray-600">
            {doctor.specialization} — {doctor.mode}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Badge variant="secondary" className="mb-2">
            {doctor.experience} years experience
          </Badge>
          <p className="leading-relaxed">{doctor.bio}</p>
          <Separator className="my-4" />
          <Button
            onClick={() => {
              setPrefillData(null);
              setTimeout(() => setShowModal(true), 0);
            }}
            className="bg-green-600 hover:bg-green-700"
          >
            Book New Appointment
          </Button>
        </CardContent>
      </Card>

      {/* Appointments List */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Your Appointments</h2>
        {appointments.length ? (
          <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2">
            {appointments.map((appointment) => (
              <Card
                key={appointment._id}
                className="border border-gray-200 shadow-md"
              >
                <CardHeader>
                  <CardTitle>
                    {new Date(appointment.slotTime).toLocaleString()}
                  </CardTitle>
                  <Badge
                    variant={
                      appointment.status === "Booked"
                        ? "default"
                        : appointment.status === "Cancelled"
                        ? "destructive"
                        : "secondary"
                    }
                  >
                    {appointment.status}
                  </Badge>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => handleCancel(appointment._id)}
                    className="text-red-600 border-red-500 hover:bg-red-50 w-full"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleReschedule(appointment)}
                    className="text-yellow-600 border-yellow-500 hover:bg-yellow-50 w-full"
                  >
                    Reschedule
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="mt-4 text-gray-500">No appointments yet.</p>
        )}
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
