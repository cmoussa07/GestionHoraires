import React, { createContext, useState, useContext } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");
    const role_id = localStorage.getItem("role_id");
    const nom = localStorage.getItem("nom");
    const email = localStorage.getItem("email");
    const enseignant_id = localStorage.getItem("enseignant_id");
    return token ? { token, role_id, nom, email, enseignant_id } : null;
  });

  function login(token, role_id, nom, email, enseignant_id) {
    localStorage.setItem("token", token);
    localStorage.setItem("role_id", role_id);
    localStorage.setItem("nom", nom);
    localStorage.setItem("email", email);
    localStorage.setItem("enseignant_id", enseignant_id);
    setUser({ token, role_id, nom, email, enseignant_id });
  }

  function logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("role_id");
    localStorage.removeItem("nom");
    localStorage.removeItem("email");
    localStorage.removeItem("enseignant_id");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
