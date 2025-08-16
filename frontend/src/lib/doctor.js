import api from "./api";
import Cookies from "js-cookie";

export const fetchDoctors = async (filters = {}) => {
  const { specialization, mode } = filters;
  const res = await api.get("/doctors", { params: { specialization, mode } });
  return res.data;
};

// Fetch a single doctor by ID
export const fetchDoctorById = async (id) => {
  const token = Cookies.get("token");
  try {
    const res = await api.get(`/doctors/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    console.error("Error fetching doctor by ID:", error);
    return null;
  }
};
