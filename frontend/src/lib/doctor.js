import api from "./api";

export const fetchDoctors = async (filters = {}) => {
  const { specialization, mode } = filters;
  const res = await api.get("/doctors", { params: { specialization, mode } });
  return res.data;
};

// Fetch a single doctor by ID
export const fetchDoctorById = async (id) => {
  const res = await api.get(`/doctors/${id}`);
  return res.data;
};
