import api from "./api";

export async function getDoctorSlots(doctorId, date) {
  const res = await api.get(`/appointments/doctor/${doctorId}/slots`, {
    params: { date },
  });
  return res.data;
}

// Lock a slot and get OTP
export async function lockSlot({ userId, doctorId, slotTime }) {
  const res = await api.post("/appointments/lock", {
    userId,
    doctorId,
    slotTime,
  });
  return res.data; // { message, appointmentId, otp }
}

// Confirm a booked slot with OTP
export async function confirmAppointment({
  userId, // replace with logged-in user ID
  doctorId,
  slotTime,
  notes,
  otp,
}) {
  const res = await api.post("/appointments/confirm", {
    userId,
    doctorId,
    slotTime,
    notes,
    otp,
  });
  return res.data;
}

// Cancel an appointment
export async function cancelAppointment(appointmentId) {
  const res = await api.delete(`/appointments/${appointmentId}`);
  return res.data;
}

export async function rescheduleAppointment({ appointmentId, newSlotTime }) {
  console.log("Rescheduling appointment:", appointmentId, "to:", newSlotTime);

  const res = await api.put(`/appointments/${appointmentId}/reschedule`, {
    newSlotTime,
  });
  return res.data;
}

export async function getUserAppointments(userId, doctorId) {
  const res = await api.get(`/appointments/${doctorId}`, {
    params: { userId },
  });
  return res.data;
}
