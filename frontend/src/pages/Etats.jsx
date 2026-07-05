import React, { useEffect, useState } from "react";
import {
  FileSpreadsheet,
  User,
  BarChart3,
  Clock,
  AlertTriangle,
  Wallet,
  Users,
  TrendingUp,
  FileDown,
  Printer,
} from "lucide-react";
import Layout from "../composants/Layout";
import api from "../services/api";
import { StatCard } from "../composants/StatCard";
import * as XLSX from "xlsx";
import {
  exportFicheEnseignantPDF,
  exportEtatGlobalPDF,
  printEtatGlobalPDF,
  printFicheEnseignantPDF,
} from "../lib/pdfutils";

/* ── helpers ── */
function Badge({ children, variant = "default" }) {
  const variants = {
    default: "bg-gray-100 text-gray-500",
    warning: "bg-amber-500/15 text-amber-700",
    success: "bg-emerald-500/15 text-emerald-700",
    danger: "bg-rose-500/15 text-rose-600",
  };
  return (
    <span
      className={`px-2.5 py-1 rounded-full text-[11px] font-bold whitespace-nowrap ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

function SectionTitle({ children }) {
  return (
    <h4
      className="font-bold text-blue-950 mb-3 mt-2"
      style={{ fontFamily: "Georgia, serif" }}
    >
      {children}
    </h4>
  );
}

function TableWrapper({ children }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-gray-100">
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

function Th({ children, right }) {
  return (
    <th
      className={`font-semibold px-4 py-3 text-xs uppercase tracking-wider text-gray-400 bg-gray-50 ${right ? "text-right" : "text-left"} whitespace-nowrap`}
    >
      {children}
    </th>
  );
}

function Td({ children, right, className = "" }) {
  return (
    <td
      className={`px-4 py-3 ${right ? "text-right tabular-nums" : ""} ${className}`}
    >
      {children}
    </td>
  );
}

/* ── Main ── */
function Etats() {
  const [enseignants, setEnseignants] = useState([]);
  const [selectedEnseignant, setSelectedEnseignant] = useState("");
  const [heuresEnseignant, setHeuresEnseignant] = useState([]);
  const [stats, setStats] = useState(null);
  const [statsGlobales, setStatsGlobales] = useState({
    totalEnseignants: 0,
    totalHeures: 0,
    heuresParDepartement: [],
    enseignantsEnDepassement: [],
    etatPaiement: [],
    equivalences: null,
  });

  useEffect(() => {
    api
      .get("/enseignants")
      .then((r) => setEnseignants(r.data))
      .catch(console.error);
    api
      .get("/dashboard")
      .then((r) => setStatsGlobales(r.data))
      .catch(console.error);
  }, []);

  async function fetchStats() {
    if (!selectedEnseignant) return;
    try {
      const [resStats, resHeures] = await Promise.all([
        api.get(`/dashboard/enseignant/${selectedEnseignant}`),
        api.get(`/heures/enseignant/${selectedEnseignant}`),
      ]);
      setStats(resStats.data);
      setHeuresEnseignant(resHeures.data);
    } catch (err) {
      console.error(err);
    }
  }

  /* ── Exports individuels ── */
  function exportPDF() {
    if (!stats) return;

    // ✅ Extraire les matières uniques depuis les heures
    const matieresUniques = [
      ...new Set(heuresEnseignant.map((h) => h.matiere).filter(Boolean)),
    ];

    exportFicheEnseignantPDF({
      enseignant: stats.enseignant,
      stats,
      heures: heuresEnseignant,
      matieres: matieresUniques,
    });
  }

  function exportExcel() {
    if (!stats) return;
    const e = stats.enseignant;
    const taux = stats.taux_utilise || 0;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["Nom", `${e.prenom} ${e.nom}`],
        ["Grade", e.grade],
        ["Département", e.departement],
        ["Statut", e.statut],
        ["Taux horaire", `${taux} FCFA/h`],
        ["Total heures", `${stats.totalHeures}h`],
        ["Heures complémentaires", `${stats.heuresComplementaires}h`],
        ["Montant total", `${stats.montantTotal} FCFA`],
      ]),
      "Informations",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["Type", "Total heures"],
        ...(stats.heuresParType?.map((h) => [h.type_heure, `${h.total}h`]) ||
          []),
      ]),
      "Heures par type",
    );
    XLSX.writeFile(wb, `fiche_${e.nom}_${e.prenom}.xlsx`);
  }

  function printPDF() {
    if (!stats) return;

    const matieresUniques = [
      ...new Set(heuresEnseignant.map((h) => h.matiere).filter(Boolean)),
    ];

    printFicheEnseignantPDF({
      enseignant: stats.enseignant,
      stats,
      heures: heuresEnseignant,
      matieres: matieresUniques,
    });
  }

  /* ── Exports globaux ── */
  function exportGlobalPDF() {
    exportEtatGlobalPDF({
      etatPaiement: statsGlobales.etatPaiement || [],
      heuresParDepartement: statsGlobales.heuresParDepartement || [],
    });
  }

  function exportGlobalExcel() {
    const equiv = statsGlobales.equivalences;
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["Département", "Total heures"],
        ...(statsGlobales.heuresParDepartement?.map((d) => [
          d.departement,
          `${d.total}h`,
        ]) || []),
      ]),
      "Par département",
    );
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        [
          "Enseignant",
          "Statut",
          "H. contractuelles",
          "Total H.",
          "H. complémentaires",
          "Taux",
          "Montant",
        ],
        ...(statsGlobales.etatPaiement?.map((e) => [
          `${e.prenom} ${e.nom}`,
          e.statut,
          `${e.heures_contractuelles}h`,
          `${e.total_heures}h`,
          `${e.heures_complementaires}h`,
          `${e.taux_utilise || 0} FCFA/h`,
          `${e.montant_a_payer} FCFA`,
        ]) || []),
      ]),
      "État paiement",
    );
    XLSX.writeFile(wb, "etat_global_heures.xlsx");
  }

  function exportComptabilite() {
    const aPayerSeulement = statsGlobales.etatPaiement?.filter(
      (e) => e.montant_a_payer > 0,
    );
    const total =
      aPayerSeulement?.reduce((s, e) => s + e.montant_a_payer, 0) || 0;

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([
        ["ÉTAT DE PAIEMENT — HEURES COMPLÉMENTAIRES"],
        [`Généré le ${new Date().toLocaleDateString("fr-FR")}`],
        [],
        [
          "Enseignant",
          "Statut",
          "H. Complémentaires",
          "Taux",
          "Montant à payer",
        ],
        ...(aPayerSeulement?.map((e) => [
          `${e.prenom} ${e.nom}`,
          e.statut,
          `${e.heures_complementaires}h`,
          `${e.taux_utilise} FCFA/h`,
          `${e.montant_a_payer} FCFA`,
        ]) || []),
        [],
        ["", "", "", "TOTAL", `${total} FCFA`],
      ]),
      "Comptabilité",
    );
    XLSX.writeFile(wb, "etat_comptabilite.xlsx");
  }

  function printGlobalPDF() {
    printEtatGlobalPDF({
      etatPaiement: statsGlobales.etatPaiement || [],
      heuresParDepartement: statsGlobales.heuresParDepartement || [],
    });
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* ── Header ── */}
        <div>
          <p className="text-xs uppercase tracking-widest text-amber-500 font-semibold mb-1">
            Espace administration
          </p>
          <h1
            className="text-3xl font-bold text-blue-950"
            style={{ fontFamily: "Georgia, serif" }}
          >
            États &amp; <span className="text-amber-500">Exports</span>
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Générez fiches individuelles et états globaux au format PDF ou
            Excel.
          </p>
        </div>

        {/* ── État global ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow">
                <BarChart3 className="h-5 w-5 text-amber-400" />
              </div>
              <div>
                <h3
                  className="font-bold text-blue-950"
                  style={{ fontFamily: "Georgia, serif" }}
                >
                  État global des heures
                </h3>
                <p className="text-xs text-gray-400">
                  Vue d'ensemble de tous les enseignants.
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={printGlobalPDF}
                className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
              >
                <Printer className="h-4 w-4" /> Imprimer
              </button>

              <button
                onClick={exportGlobalPDF}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
              >
                <FileDown className="h-4 w-4" /> PDF
              </button>
              <button
                onClick={exportGlobalExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> Excel
              </button>
              <button
                onClick={exportComptabilite}
                className="flex items-center gap-2 px-4 py-2 bg-blue-700 text-white rounded-xl text-sm hover:bg-blue-800 transition-colors"
              >
                <FileSpreadsheet className="h-4 w-4" /> Comptabilité
              </button>
            </div>
          </div>

          {/* Cards globales */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total enseignants"
              value={statsGlobales.totalEnseignants ?? 0}
              icon={Users}
              gradient="from-blue-900/10 to-blue-900/0"
              color="text-blue-900"
            />
            <StatCard
              label="Total heures"
              value={`${statsGlobales.totalHeures ?? 0}h`}
              icon={TrendingUp}
              gradient="from-emerald-500/10 to-emerald-500/0"
              color="text-emerald-700"
            />
            <StatCard
              label="En dépassement"
              value={statsGlobales.enseignantsEnDepassement?.length ?? 0}
              icon={AlertTriangle}
              gradient="from-rose-500/10 to-rose-500/0"
              color="text-rose-600"
            />
          </div>

          {/* Heures par département */}
          <div className="px-6 pb-6">
            <SectionTitle>Heures par département</SectionTitle>
            <TableWrapper>
              <thead>
                <tr>
                  <Th>Département</Th>
                  <Th right>Total heures</Th>
                </tr>
              </thead>
              <tbody>
                {statsGlobales.heuresParDepartement?.length === 0 && (
                  <tr>
                    <td
                      colSpan="2"
                      className="px-4 py-6 text-center text-gray-400 text-sm"
                    >
                      Aucune donnée
                    </td>
                  </tr>
                )}
                {statsGlobales.heuresParDepartement?.map((d, i) => (
                  <tr
                    key={i}
                    className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                  >
                    <Td>
                      <span className="font-semibold text-blue-950">
                        {d.departement}
                      </span>
                    </Td>
                    <Td right>
                      <span className="text-gray-500">{d.total}h</span>
                    </Td>
                  </tr>
                ))}
              </tbody>
            </TableWrapper>
          </div>

          {/* État de paiement */}
          <div className="px-6 pb-6">
            <SectionTitle>État de paiement par enseignant</SectionTitle>
            <TableWrapper>
              <thead>
                <tr>
                  {[
                    "Enseignant",
                    "H. Contract.",
                    "Total H.",
                    "H. Compl.",
                    "Taux",
                    "Montant",
                    "Statut",
                  ].map((h) => (
                    <Th key={h}>{h}</Th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statsGlobales.etatPaiement?.length === 0 && (
                  <tr>
                    <td
                      colSpan="7"
                      className="px-4 py-6 text-center text-gray-400 text-sm"
                    >
                      Aucune donnée
                    </td>
                  </tr>
                )}
                {statsGlobales.etatPaiement?.map((e, i) => {
                  const depass =
                    Number(e.total_equivalent) >
                    Number(e.heures_contractuelles);
                  return (
                    <tr
                      key={i}
                      className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <Td>
                        <span className="font-semibold text-blue-950 whitespace-nowrap">
                          {e.prenom} {e.nom}
                        </span>
                      </Td>
                      <Td>
                        <span className="text-gray-500 tabular-nums">
                          {e.heures_contractuelles}h
                        </span>
                      </Td>
                      <Td>
                        <span className="text-gray-500 tabular-nums">
                          {e.total_heures}h
                        </span>
                      </Td>
                      <Td>
                        <Badge
                          variant={
                            e.heures_complementaires > 0 ? "warning" : "default"
                          }
                        >
                          {e.heures_complementaires}h
                        </Badge>
                      </Td>
                      <Td>
                        {/* ✅ taux_utilise depuis Approche B */}
                        <span className="text-gray-500 tabular-nums whitespace-nowrap">
                          {e.taux_utilise || 0} FCFA/h
                        </span>
                      </Td>
                      <Td>
                        <span className="font-bold text-emerald-700 tabular-nums whitespace-nowrap">
                          {e.montant_a_payer} FCFA
                        </span>
                      </Td>
                      <Td>
                        <Badge variant={depass ? "danger" : "success"}>
                          {depass ? "⚠ Dépassement" : "✓ Normal"}
                        </Badge>
                      </Td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWrapper>
          </div>
        </div>

        {/* ── Fiche individuelle ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-blue-900 to-blue-700 shadow">
              <User className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h3
                className="font-bold text-blue-950"
                style={{ fontFamily: "Georgia, serif" }}
              >
                Fiche individuelle enseignant
              </h3>
              <p className="text-xs text-gray-400">
                Sélectionnez un enseignant pour consulter ses statistiques.
              </p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-3 md:items-end">
            <div className="flex-1">
              <label className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1.5">
                Enseignant
              </label>
              <select
                value={selectedEnseignant}
                onChange={(e) => setSelectedEnseignant(e.target.value)}
                className="w-full h-10 px-3 rounded-xl bg-gray-50 border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
              >
                <option value="">Sélectionner un enseignant…</option>
                {enseignants.map((e) => (
                  <option key={e.idenseignant} value={e.idenseignant}>
                    {e.prenom} {e.nom}
                  </option>
                ))}
              </select>
            </div>
            <button
              onClick={fetchStats}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-semibold hover:brightness-90 transition-all shadow"
              style={{
                background: "linear-gradient(135deg, #f5a623, #f0850a)",
              }}
            >
              Afficher
            </button>
          </div>
        </div>

        {/* ── Détail enseignant ── */}
        {stats && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div
                  className="h-12 w-12 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow"
                  style={{
                    background: "linear-gradient(135deg, #1a3a6b, #0f2d5e)",
                  }}
                >
                  {stats.enseignant.prenom?.[0]}
                  {stats.enseignant.nom?.[0]}
                </div>
                <div>
                  <h3
                    className="font-bold text-blue-950"
                    style={{ fontFamily: "Georgia, serif" }}
                  >
                    {stats.enseignant.prenom} {stats.enseignant.nom}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {stats.enseignant.grade} — {stats.enseignant.departement}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={printPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl text-sm hover:bg-slate-800 transition-colors"
                >
                  <Printer className="h-4 w-4" /> Imprimer
                </button>
                <button
                  onClick={exportPDF}
                  className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-colors"
                >
                  <FileDown className="h-4 w-4" /> PDF
                </button>
                <button
                  onClick={exportExcel}
                  className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl text-sm hover:bg-green-700 transition-colors"
                >
                  <FileSpreadsheet className="h-4 w-4" /> Excel
                </button>
              </div>
            </div>

            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                ["Grade", stats.enseignant.grade],
                ["Département", stats.enseignant.departement],
                ["Statut", stats.enseignant.statut],
                ["Taux horaire", `${stats.taux_utilise || 0} FCFA/h`],
              ].map(([k, v]) => (
                <div key={k} className="rounded-xl bg-gray-50 p-3">
                  <p className="text-[11px] uppercase tracking-wider text-gray-400 font-semibold">
                    {k}
                  </p>
                  <p className="font-semibold text-blue-950 mt-1">{v}</p>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="px-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <StatCard
                label="Total heures"
                value={`${stats.totalHeures}h`}
                icon={Clock}
                gradient="from-blue-900/10 to-blue-900/0"
                color="text-blue-900"
              />
              <StatCard
                label="Heures complémentaires"
                value={`${stats.heuresComplementaires}h`}
                icon={AlertTriangle}
                gradient="from-amber-500/10 to-amber-500/0"
                color="text-amber-600"
              />
              <StatCard
                label="Montant à payer"
                value={`${stats.montantTotal} FCFA`}
                icon={Wallet}
                gradient="from-emerald-500/10 to-emerald-500/0"
                color="text-emerald-700"
              />
            </div>

            {/* Heures par type */}
            <div className="p-6">
              <SectionTitle>Heures par type</SectionTitle>
              <TableWrapper>
                <thead>
                  <tr>
                    <Th>Type</Th>
                    <Th right>Total</Th>
                  </tr>
                </thead>
                <tbody>
                  {stats.heuresParType?.length === 0 && (
                    <tr>
                      <td
                        colSpan="2"
                        className="px-4 py-6 text-center text-gray-400 text-sm"
                      >
                        Aucune donnée
                      </td>
                    </tr>
                  )}
                  {stats.heuresParType?.map((h) => (
                    <tr
                      key={h.type_heure}
                      className="border-t border-gray-50 hover:bg-gray-50/60 transition-colors"
                    >
                      <Td>
                        <span className="font-semibold text-blue-950">
                          {h.type_heure}
                        </span>
                      </Td>
                      <Td right>
                        <span className="text-gray-500">{h.total}h</span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </TableWrapper>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default Etats;
