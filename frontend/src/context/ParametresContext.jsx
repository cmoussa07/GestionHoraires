import React, { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const defaultValue = {
  anneeActive: "—",
  parametres: null,
  setParametres: () => {},
  fetchParametres: () => {},
  loading: true,
};

const ParametresContext = createContext(defaultValue);

export function ParametresProvider({ children }) {
  const [anneeActive, setAnneeActive] = useState("—");
  const [parametres, setParametres] = useState(null);
  const [loading, setLoading] = useState(true);

  async function fetchParametres() {
    try {
      const res = await api.get("/parametres");
      console.log("Paramètres reçus:", res.data);

      if (!Array.isArray(res.data) || res.data.length === 0) {
        setParametres(null);
        setAnneeActive("—");
        return;
      }

      // Chercher l'année active (active = 1)
      let actif = res.data.find((p) => p.active == 1);

      // Sinon prendre la première
      if (!actif) actif = res.data[0];

      setParametres(actif || null);

      // Afficher l'année si disponible
      if (actif && actif.annee) {
        setAnneeActive(actif.annee);
      } else {
        setAnneeActive("—");
      }
    } catch (error) {
      console.error("Erreur chargement paramètres:", error);
      setParametres(null);
      setAnneeActive("—");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchParametres();
  }, []);

  return (
    <ParametresContext.Provider
      value={{
        anneeActive,
        parametres,
        setParametres,
        fetchParametres,
        loading,
      }}
    >
      {children}
    </ParametresContext.Provider>
  );
}

export function useParametres() {
  return useContext(ParametresContext);
}
