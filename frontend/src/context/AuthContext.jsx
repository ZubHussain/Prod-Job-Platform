import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { api } from "../lib/api";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("jobnova_user") || "null"));
  const [loading, setLoading] = useState(false);

  const save = (data) => {
    localStorage.setItem("jobnova_token", data.token);
    localStorage.setItem("jobnova_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const login = async values => { setLoading(true); try { const {data}=await api.post("/auth/login", values); save(data); return data; } finally { setLoading(false); } };
  const register = async values => { setLoading(true); try { const {data}=await api.post("/auth/register", values); save(data); return data; } finally { setLoading(false); } };
  const logout = () => { localStorage.removeItem("jobnova_token"); localStorage.removeItem("jobnova_user"); setUser(null); };

  useEffect(() => {
    if (!localStorage.getItem("jobnova_token")) return;
    api.get("/auth/me").then(({data}) => {
      const next = { id:data.id, name:data.name, email:data.email, role:data.role, companyName:data.companyName };
      localStorage.setItem("jobnova_user", JSON.stringify(next));
      setUser(next);
    }).catch(logout);
  }, []);

  const value = useMemo(()=>({ user, loading, login, register, logout }),[user,loading]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
