import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap, Menu, X } from "lucide-react";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const liens = [
    { label: "Fonctionnalités", href: "#fonctionnalites" },
    { label: "Utilisateurs", href: "#utilisateurs" },
    { label: "Tableau de bord", href: "#dashboard" },
    { label: "Processus", href: "#processus" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
      <nav className="max-w-7xl mx-auto flex h-20 items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <div
            className="p-2.5 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #f5a623, #f0850a)",
            }}
          >
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <div
              className="font-bold text-lg text-gray-900"
              style={{ fontFamily: "Playfair Display, serif" }}
            >
              GestHeure
            </div>
            <div className="text-[10px] uppercase tracking-widest text-gray-400">
              Académie Pro
            </div>
          </div>
        </div>

        <div className="hidden md:flex items-center gap-8">
          {liens.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-all relative group"
            >
              {l.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 group-hover:w-full transition-all duration-300"
                style={{ background: "#f5a623" }}
              />
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900  hover:bg-gray-200 rounded-lg transition-all"
          >
            Connexion
          </button>
        </div>

        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-gray-700"
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-6 py-4 flex flex-col gap-3">
          {liens.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-gray-600 hover:text-gray-900 py-2 text-sm font-medium"
            >
              {l.label}
            </a>
          ))}
          <button
            onClick={() => navigate("/login")}
            className="w-full py-3 rounded-xl text-white font-semibold text-sm"
            style={{ background: "linear-gradient(135deg, #f5a623, #f0850a)" }}
          >
            Se connecter
          </button>
        </div>
      )}
    </header>
  );
}

export default Navbar;
