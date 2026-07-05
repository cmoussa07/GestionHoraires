import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  Clock,
  FileText,
  Settings,
  CheckSquare,
  Calendar,
  User,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Sidebar({
  enseignants,
  matieres,
  heures,
  anneeActive,
}) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuPrincipal = [
    {
      label: "Mon tableau de bord",
      icon: LayoutDashboard,
      path: "/dashboard",
      roles: [1, 2],
    },
    {
      label: "Enseignants",
      icon: Users,
      path: "/enseignants",
      roles: [1],
      badge: enseignants?.length || 0,
    },
    {
      label: "Heures déclarées",
      icon: Clock,
      path: "/heures",
      roles: [1, 2],
      badge: heures?.length || 0,
    },
    {
      label: "Matieres & Filières",
      icon: BookOpen,
      path: "/matieres",
      roles: [1],
      badge: matieres?.length || 0,
    },
    {
      label: "États de paiements",
      icon: FileText,
      path: "/etats",
      roles: [1, 2],
      badge: 2,
    },
    {
      label: "Mon profil",
      icon: User,
      path: "/profil",
      roles: [3],
    },
    {
      label: "Mes heures",
      icon: Clock,
      path: "/mes-heures",
      roles: [3],
    },
    {
      label: "Validations",
      icon: CheckSquare,
      path: "/validations",
      roles: [2],
    },
    { label: "Paramètres", icon: Settings, path: "/parametres", roles: [1] },
  ];

  function renderItems(items) {
    return items
      .filter((item) => item.roles.includes(parseInt(user?.role_id)))
      .map((item, i) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        return (
          <li
            key={i}
            onClick={() => navigate(item.path)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer transition-all duration-200
  ${isActive ? "text-white font-semibold" : "text-white/60 hover:text-white hover:bg-white/10"}`}
            style={
              isActive
                ? { background: "linear-gradient(135deg, #f5a623, #f0850a)" }
                : {}
            }
          >
            <Icon className="h-5 w-5 shrink-0" />
            <span className="text-sm flex-1">{item.label}</span>
            {item.badge !== undefined && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-white/20 text-white min-w-[20px] text-center">
                {item.badge}
              </span>
            )}
          </li>
        );
      });
  }

  return (
    <aside
      className="h-screen w-64 flex flex-col fixed left-0 top-0 z-40"
      style={{
        background: "linear-gradient(180deg, #1a3a6b 0%, #0f2d5e 100%)",
      }}
    >
      {/* ── Header ── */}
      <div className="flex items-center h-16 px-4 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3">
          <div
            className="p-2 rounded-xl"
            style={{ background: "linear-gradient(135deg, #f5a623, #f0850a)" }}
          >
            <GraduationCap className="h-5 w-5 text-white" />
          </div>
          <div>
            <div
              className="font-bold text-white text-base"
              style={{ fontFamily: "Georgia, serif" }}
            >
              GestHeure
            </div>
            <div className="text-[10px] uppercase tracking-widest text-white/40">
              Académie Pro
            </div>
          </div>
        </div>
      </div>

      {/* ── Menu ── */}
      <div className="flex-1 overflow-y-auto py-4 px-2">
        <p className="text-[10px] uppercase tracking-widest text-white/30 font-semibold mb-2 px-3">
          Principal
        </p>
        <ul className="space-y-1">{renderItems(menuPrincipal)}</ul>
      </div>

      {/* ── Année académique ── */}
      <div className="mx-3 mb-3 rounded-xl overflow-hidden">
        <div
          className="p-4 relative"
          style={{
            background:
              "linear-gradient(135deg, rgba(245,166,35,0.15), rgba(240,133,10,0.08))",
          }}
        >
          {/* Barre colorée en haut */}
          <div
            className="absolute top-0 left-0 right-0 h-0.5"
            style={{ background: "linear-gradient(90deg, #f5a623, #f0850a)" }}
          />
          <div className="flex items-center gap-2 mb-1">
            <Calendar className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-[10px] uppercase tracking-widest text-white/40 font-semibold">
              Année académique
            </span>
          </div>
          <div className="text-white font-bold text-sm tracking-wide">
            {anneeActive || "—"}
          </div>
        </div>
      </div>
    </aside>
  );
}
