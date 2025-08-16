"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  Clock,
  User,
  FileText,
  Check,
  ArrowRight,
  ArrowLeft,
  Smartphone,
  Shield,
  CheckCircle2,
  X,
} from "lucide-react";
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
  const isRescheduling = !!prefillData;

  const initialDate = prefillData?.slotTime
    ? new Date(prefillData.slotTime).toISOString().split("T")[0]
    : "";

  const initialSlot = prefillData?.slotTime
    ? new Date(prefillData.slotTime).toISOString()
    : "";

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
    if (!formData.slot) return;
    try {
      setLoading(true);
      const res = await lockSlot({
        userId: "689dbf9887b33ac0090d630a", // replace with logged-in user ID
        doctorId,
        slotTime: formData.slot,
        notes: formData.notes,
      });
      setStep(2);
      // Show mock OTP in production this would be sent via SMS/email
      alert(`OTP sent: ${res.otp}`);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!otp) return;
    try {
      setLoading(true);
      let appointment;

      if (isRescheduling) {
        const res = await rescheduleAppointment({
          appointmentId: prefillData._id || prefillData.appointmentId,
          newSlotTime: formData.slot,
        });
        appointment = res.data || res;
        setSuccessMsg("✅ Appointment rescheduled successfully!");
      } else {
        const res = await confirmAppointment({
          userId: "689dbf9887b33ac0090d630a",
          doctorId,
          slotTime: formData.slot,
          notes: formData.notes,
          otp,
        });

        if (res?.appointment) {
          setSuccessMsg("✅ Appointment confirmed successfully!");
          onSuccess(res.data);
        }
      }

      setStep(3);
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (timeString) => {
    return new Date(timeString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] p-0 gap-0 bg-white flex flex-col">
        <DialogHeader className="rounded-t-md px-6 py-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white ">
          <div className="flex items-center justify-between ">
            <div>
              <DialogTitle className="text-xl font-bold">
                {isRescheduling
                  ? "Reschedule Appointment"
                  : "Book New Appointment"}
              </DialogTitle>
              <DialogDescription className="text-blue-100 mt-1">
                with {doctor.name}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Progress Indicator */}
        <div className="px-6 py-3 bg-white border-b flex-shrink-0">
          <div className="flex items-center justify-center space-x-4">
            <div
              className={`flex items-center space-x-2 ${
                step >= 1 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 1
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {step > 1 ? <Check className="h-4 w-4" /> : "1"}
              </div>
              <span className="text-sm font-medium">Select Time</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 2 ? "bg-blue-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                step >= 2 ? "text-blue-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 2
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {step > 2 ? <Check className="h-4 w-4" /> : "2"}
              </div>
              <span className="text-sm font-medium">Verify</span>
            </div>
            <div
              className={`w-12 h-0.5 ${
                step >= 3 ? "bg-green-600" : "bg-gray-300"
              }`}
            ></div>
            <div
              className={`flex items-center space-x-2 ${
                step >= 3 ? "text-green-600" : "text-gray-400"
              }`}
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                  step >= 3
                    ? "border-green-600 bg-green-600 text-white"
                    : "border-gray-300"
                }`}
              >
                {step >= 3 ? <Check className="h-4 w-4" /> : "3"}
              </div>
              <span className="text-sm font-medium">Confirm</span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Step 1: Select Date and Time */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="date"
                      className="text-base font-semibold flex items-center"
                    >
                      <Calendar className="mr-2 h-4 w-4 text-blue-600" />
                      Select Date
                    </Label>
                    <Input
                      id="date"
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleChange}
                      className="text-base"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>

                  {formData.date && slots.length > 0 && (
                    <div className="space-y-3">
                      <Label className="text-base font-semibold flex items-center">
                        <Clock className="mr-2 h-4 w-4 text-blue-600" />
                        Available Time Slots
                      </Label>
                      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                          <div className="grid grid-cols-3 gap-2">
                            {slots.map((slot) => (
                              <Button
                                key={slot}
                                variant={
                                  formData.slot === slot ? "default" : "outline"
                                }
                                size="sm"
                                onClick={() =>
                                  setFormData({ ...formData, slot })
                                }
                                className={`text-sm ${
                                  formData.slot === slot
                                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                                    : "hover:bg-blue-100 border-blue-200"
                                }`}
                              >
                                {formatTime(slot)}
                              </Button>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label
                      htmlFor="notes"
                      className="text-base font-semibold flex items-center"
                    >
                      <FileText className="mr-2 h-4 w-4 text-blue-600" />
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder="Any specific concerns or notes for the doctor..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                {/* Summary */}
                {formData.date && formData.slot && (
                  <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center text-blue-800">
                        <User className="mr-2 h-5 w-5" />
                        Appointment Summary
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Doctor:</span>
                        <span className="font-medium">{doctor.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Date:</span>
                        <span className="font-medium">
                          {formatDate(formData.date)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Time:</span>
                        <span className="font-medium">
                          {formatTime(formData.slot)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <Badge variant="secondary">{doctor.mode}</Badge>
                      </div>
                    </CardContent>
                  </Card>
                )}

                <div className="flex justify-end gap-3 pt-4">
                  <Button variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleLockSlot}
                    disabled={loading || !formData.slot}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        {isRescheduling ? "Rescheduling..." : "Processing..."}
                      </>
                    ) : (
                      <>
                        Next Step
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 2: OTP Verification */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                    <Smartphone className="h-8 w-8 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      Verify Your Identity
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Weve sent a verification code to your registered mobile
                      number
                    </p>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
                  <CardContent className="p-4 flex items-center space-x-3">
                    <Shield className="h-5 w-5 text-amber-600" />
                    <div className="text-sm text-amber-800">
                      <strong>Security Note:</strong> This helps us ensure the
                      appointment is booked by you.
                    </div>
                  </CardContent>
                </Card>

                <div className="space-y-2">
                  <Label htmlFor="otp" className="text-base font-semibold">
                    Enter Verification Code
                  </Label>
                  <Input
                    id="otp"
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="text-center text-lg tracking-widest font-mono"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-between gap-3 pt-4">
                  <Button variant="outline" onClick={() => setStep(1)}>
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back
                  </Button>
                  <Button
                    onClick={handleConfirm}
                    disabled={loading || !otp}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Confirming...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Confirm Appointment
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {step === 3 && (
              <div className="space-y-6 text-center">
                <div className="space-y-4">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="h-10 w-10 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      {isRescheduling
                        ? "Appointment Rescheduled!"
                        : "Appointment Confirmed!"}
                    </h3>
                    <p className="text-gray-600 mt-2">
                      {isRescheduling
                        ? "Your appointment has been successfully rescheduled."
                        : "Your appointment has been successfully booked."}
                    </p>
                  </div>
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <CardContent className="p-4 space-y-2 text-left">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Doctor:</span>
                      <span className="font-medium">Dr. {doctor.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Date & Time:</span>
                      <span className="font-medium">
                        {formatDate(formData.date)} at{" "}
                        {formatTime(formData.slot)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge className="bg-green-100 text-green-800 border-green-200">
                        Confirmed
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                <p className="text-sm text-gray-500">
                  You will receive a confirmation email and SMS shortly. This
                  window will close automatically.
                </p>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
