import api from "./api";

export const signin = async (email, password) => {
  const res = await api.post("/auth/signin", { email, password });
  return res.data;
};

export const signup = async (name, email, password) => {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
};
