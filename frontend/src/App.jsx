import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TooltipProvider } from "@/composants/ui/tooltip";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Enseignants from "./pages/Enseignants";
import Matieres from "./pages/Matieres";
import Heures from "./pages/Heures";
import Etats from "./pages/Etats";
import Parametres from "./pages/Parametres";
import PageErreur from "./pages/PageErreur";
import MesHeures from "./pages/MesHeures";
import LandingPage from "./pages/landing/LandingPage";
import Validations from "./pages/Validations";
import Profil from "./pages/Profil";
import MonCompte from "./pages/MonCompte";

/* ─────────────── ROUTES PROTÉGÉES ─────────────── */

function PrivateRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const roleId = Number(user.role_id);

  if (!allowedRoles.includes(roleId)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function DashboardRoute() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  if (Number(user.role_id) === 3) {
    return <Navigate to="/profil" replace />;
  }

  return <Dashboard />;
}

/* ─────────────── APP ─────────────── */

function App() {
  return (
    <AuthProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            {/* PUBLIC */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />

            {/* PRIVE */}
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <DashboardRoute />
                </PrivateRoute>
              }
            />

            {/* ADMIN*/}
            <Route
              path="/enseignants"
              element={
                <RoleRoute allowedRoles={[1]}>
                  <Enseignants />
                </RoleRoute>
              }
            />

            <Route
              path="/matieres"
              element={
                <RoleRoute allowedRoles={[1]}>
                  <Matieres />
                </RoleRoute>
              }
            />

            <Route
              path="/parametres"
              element={
                <RoleRoute allowedRoles={[1]}>
                  <Parametres />
                </RoleRoute>
              }
            />

            {/* ADMIN + RH */}
            <Route
              path="/heures"
              element={
                <RoleRoute allowedRoles={[1, 2]}>
                  <Heures />
                </RoleRoute>
              }
            />

            <Route
              path="/etats"
              element={
                <RoleRoute allowedRoles={[1, 2]}>
                  <Etats />
                </RoleRoute>
              }
            />

            <Route
              path="/validations"
              element={
                <RoleRoute allowedRoles={[2]}>
                  <Validations />
                </RoleRoute>
              }
            />

            {/* Utilisateur connecté */}
            <Route
              path="/mes-heures"
              element={
                <PrivateRoute>
                  <MesHeures />
                </PrivateRoute>
              }
            />

            <Route
              path="/profil"
              element={
                <PrivateRoute>
                  <Profil />
                </PrivateRoute>
              }
            />

            <Route
              path="/mon-compte"
              element={
                <PrivateRoute>
                  <MonCompte />
                </PrivateRoute>
              }
            />

            {/* 404 */}
            <Route path="*" element={<PageErreur />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  );
}

export default App;
