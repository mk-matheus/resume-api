"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import type { User, MeResponse } from "@/types";

interface AuthContextType {
  user: User | null;
  personId: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

interface RegisterData {
  username: string;
  email: string;
  password: string;
  name: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [personId, setPersonId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Restaura sessão ao carregar
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) { setLoading(false); return; }

    api.get<MeResponse>("/auth/me")
      .then(({ data }) => {
        setUser({ id: data.id, username: data.username, email: data.email });
        setPersonId(data.Person?.objectId ?? null);
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })
      .finally(() => setLoading(false));
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", data.token);
    setUser(data.user);

    // Busca o personId logo após login
    const me = await api.get<MeResponse>("/auth/me");
    setPersonId(me.data.Person?.objectId ?? null);

    router.push("/dashboard");
  };

  const register = async (formData: RegisterData) => {
    const { data } = await api.post("/auth/register", formData);
    localStorage.setItem("token", data.token);
    setUser(data.user);
    setPersonId(data.person?.id ?? null);
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setPersonId(null);
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, personId, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
