import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import api from "../services/api";
import { Search, LogOut, Settings } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";

/* ─── Badge rôle ──────────────────────────────────────────── */
function RoleBadge({ role_id }) {
  const config = {
    1: { label: "Administrateur", bg: "bg-blue-100", text: "text-blue-700" },
    2: { label: "RH", bg: "bg-purple-100", text: "text-purple-700" },
    3: { label: "Enseignant", bg: "bg-amber-100", text: "text-amber-700" },
  };
  const c = config[role_id] || config[1];
  return (
    <span
      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${c.bg} ${c.text}`}
    >
      {c.label}
    </span>
  );
}

/* ─── Menu utilisateur ────────────────────────────────────── */
function UserMenu({ user }) {
  const [open, setOpen] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    function handleClick(e) {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const role_id = Number(user?.role_id);

  function handleMonCompte() {
    setOpen(false);
    navigate("/mon-compte");
  }

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex items-center gap-2 focus:outline-none"
        title={user?.email || ""}
      >
        <div
          className="h-9 w-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 hover:brightness-110 transition-all"
          style={{ background: "linear-gradient(135deg, #f5a623, #f0850a)" }}
        >
          {user?.nom?.[0]?.toUpperCase() || "A"}
          {user?.prenom?.[0]?.toUpperCase() || "D"}
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden z-50">
          {/* Infos utilisateur */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-blue-950 truncate">
                {user?.nom}
              </p>
              <RoleBadge role_id={role_id} />
            </div>
            <p className="text-xs text-gray-400 truncate">{user?.email}</p>
          </div>

          {/* Actions */}
          <div className="py-1">
            {role_id !== 3 && (
              <button
                onClick={handleMonCompte}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Settings className="h-4 w-4 text-gray-400" />
                Mon compte
              </button>
            )}

            <div className="border-t border-gray-100 my-1" />

            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4" /> Déconnexion
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Layout principal ────────────────────────────────────── */
function Layout({ children }) {
  const { user } = useAuth();
  const [anneeActive, setAnneeActive] = useState("—");
  const [enseignants, setEnseignants] = useState([]);
  const [matieres, setMatieres] = useState([]);
  const [heures, setHeures] = useState([]);

  useEffect(() => {
    api
      .get("/enseignants")
      .then((r) => setEnseignants(r.data))
      .catch(console.error);
    api
      .get("/matieres")
      .then((r) => setMatieres(r.data))
      .catch(console.error);
    api
      .get("/heures")
      .then((r) => setHeures(r.data))
      .catch(console.error);
    api
      .get("/parametres")
      .then((r) => {
        const actif = r.data.find((p) => p.active === 1);
        if (actif) setAnneeActive(actif.annee);
      })
      .catch(console.error);
  }, []);

  return (
    <div className="flex bg-gray-50 h-screen overflow-hidden">
      <Sidebar
        enseignants={enseignants}
        matieres={matieres}
        heures={heures}
        anneeActive={anneeActive}
      />

      <div className="flex-1 flex flex-col ml-64 h-screen overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-white border-b border-gray-100 flex items-center justify-between px-6 sticky top-0 z-30 shadow-sm">
          <div className="flex items-center gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un enseignant, une filière..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:border-transparent"
                style={{ "--tw-ring-color": "#f5a623" }}
              />
            </div>
          </div>
          <UserMenu user={user} />
        </header>

        {/* Contenu */}
        <motion.main
          className="flex-1 overflow-y-auto overflow-x-hidden p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          {children}
        </motion.main>
      </div>
    </div>
  );
}

export default Layout;
