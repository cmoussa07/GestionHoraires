import React from "react";
import { useNavigate } from "react-router-dom";
import { GraduationCap } from "lucide-react";

function PageErreur() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="flex h-16 w-16 items-center justify-center rounded-lg bg-blue-100 mb-6">
        <GraduationCap className="h-8 w-8 text-[#1a47cc]" />
      </div>
      <h1 className="text-6xl font-bold text-[#1a47cc] mb-4">404</h1>
      <p className="text-xl text-gray-600 mb-2">Page non trouvée</p>
      <p className="text-sm text-gray-400 mb-8">
        La page que vous cherchez n'existe pas.
      </p>
      <button
        onClick={() => navigate("/dashboard")}
        className="px-6 py-2.5 bg-[#1a47cc] text-white rounded-lg text-sm font-medium hover:brightness-90"
      >
        Retour au tableau de bord
      </button>
    </div>
  );
}

export default PageErreur;
