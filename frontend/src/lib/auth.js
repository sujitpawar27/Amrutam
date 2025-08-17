import api from "./api";

export const signin = async (email, password) => {
  const res = await api.post("/auth/signin", { email, password });
  return res.data;
};

export const signup = async (name, email, password) => {
  const res = await api.post("/auth/signup", { name, email, password });
  return res.data;
};

export async function checkAuth() {
  try {
    const { data } = await api.get("/auth/isAuthenticated");
    return { authenticated: true, user: data.user };
  } catch (error) {
    return { authenticated: false, user: null };
  }
}

export async function logout() {
  try {
    const res = await api.post("/auth/logout");
    return res;
  } catch (error) {
    console.log("Logout error:", error);
  }
}
