import api from "./api";

export async function getDoctorSlots(doctorId, date) {
  const res = await api.get(`/appointments/doctor/${doctorId}/slots`, {
    params: { date },
  });
  return res.data;
}

// Lock a slot and get OTP
export async function lockSlot({ doctorId, slotTime, notes }) {
  const res = await api.post("/appointments/lock", {
    doctorId,
    slotTime,
    notes,
  });
  return res.data; // { message, otp }
}

// Confirm a booked slot with OTP
export async function confirmAppointment({ doctorId, otp }) {
  try {
    const res = await api.post("/appointments/confirm", {
      doctorId,
      otp,
    });
    return res.data;
  } catch (error) {
    console.error("Error confirming appointment:", error);
    throw error;
  }
}

// Cancel an appointment
export async function cancelAppointment(appointmentId) {
  try {
    const res = await api.delete(`/appointments/${appointmentId}`);
    return res.data;
  } catch (error) {
    console.error("Error canceling appointment:", error);
    throw error;
  }
}

export async function rescheduleAppointment({ appointmentId, newSlotTime }) {
  try {
    console.log("Rescheduling appointment:", appointmentId, "to:", newSlotTime);

    const res = await api.patch(`/appointments/${appointmentId}/reschedule`, {
      newSlotTime,
    });
    return res.data;
  } catch (error) {
    console.error("Error rescheduling appointment:", error);
    throw error;
  }
}

export async function getUserAppointments(doctorId) {
  try {
    const res = await api.get(`/appointments/${doctorId}`);
    console.log("Appointments response:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user appointments:", error);
    return { appointments: [] };
  }
}
