"use client";
import { useState, useEffect } from "react";
import {
  getDoctorSlots,
  lockSlot,
  confirmAppointment,
  rescheduleAppointment,
} from "@/lib/appointment";

export default function BookAppointmentModal({
  doctor,
  onClose,
  prefillData,
  onSuccess,
}) {
  const doctorId = doctor._id;
  const initialDate = prefillData?.slotTime
    ? new Date(prefillData.slotTime).toISOString().split("T")[0]
    : "";

  const initialSlot = prefillData?.slotTime
    ? new Date(prefillData.slotTime).toISOString()
    : "";
  console.log("initialSlot", initialSlot);

  const [formData, setFormData] = useState({
    date: initialDate,
    slot: initialSlot,
    notes: prefillData?.notes || "",
  });

  const [step, setStep] = useState(1);
  const [slots, setSlots] = useState([]);
  const [appointmentId, setAppointmentId] = useState(
    prefillData?.appointmentId || null
  );
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (formData.date) {
      getDoctorSlots(doctorId, formData.date)
        .then((res) => setSlots(res.slots))
        .catch(console.error);
    }
  }, [formData.date, doctorId]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleLockSlot = async () => {
    if (!formData.slot) return alert("Please select a slot");
    try {
      setLoading(true);
      const res = await lockSlot({
        userId: "689dbf9887b33ac0090d630a", // replace with logged-in user ID
        doctorId,
        slotTime: formData.slot,
        notes: formData.notes,
      });
      setStep(2);
      alert(`OTP sent: ${res.otp}`); // mock for dev
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to lock slot");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp) return alert("Enter OTP");
    try {
      setLoading(true);
      let appointment;

      if (prefillData) {
        console.log("Rescheduling appointment:", prefillData);

        const res = await rescheduleAppointment({
          appointmentId: prefillData._id || prefillData.appointmentId,
          newSlotTime: formData.slot,
        });
        appointment = res.data || res;
        setSuccessMsg("✅ Appointment rescheduled!");
      } else {
        console.log("Booking new appointment:", formData);

        const res = await confirmAppointment({
          userId: "689dbf9887b33ac0090d630a",
          doctorId,
          slotTime: formData.slot,
          notes: formData.notes,
          otp,
        });
        console.log("Confirm response:", res);

        if (res?.appointment) {
          setSuccessMsg("✅ Appointment confirmed!");
          onSuccess(res.data);
        }
      }

      setTimeout(onClose, 1500);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to confirm");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 backdrop-blur-xs bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">
              {prefillData ? "Reschedule Appointment" : "Book Appointment"}
            </h2>

            <label className="block mb-2">
              Date:
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </label>

            {formData.date && (
              <label className="block mb-2">
                Available Slots:
                <select
                  name="slot"
                  value={formData.slot}
                  onChange={handleChange}
                  className="border p-2 rounded w-full"
                >
                  <option value="">Select a slot</option>
                  {slots.map((s) => (
                    <option key={s} value={s}>
                      {new Date(s).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </option>
                  ))}
                </select>
              </label>
            )}

            <label className="block mb-4">
              Notes (optional):
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="border p-2 rounded w-full"
              />
            </label>

            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleLockSlot}
                disabled={loading || !formData.slot}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading
                  ? prefillData
                    ? "Rescheduling..."
                    : "Locking..."
                  : prefillData
                  ? "Reschedule"
                  : "Next"}
              </button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Confirm Appointment</h2>
            <p className="mb-2">Enter the OTP sent to your device.</p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full mb-4"
              placeholder="Enter OTP"
            />
            {successMsg && (
              <div className="bg-green-100 text-green-700 p-2 rounded mb-3">
                {successMsg}
              </div>
            )}
            <div className="flex justify-end gap-2">
              <button
                onClick={onClose}
                className="bg-gray-200 px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading || !otp}
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? "Confirming..." : "Confirm"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
