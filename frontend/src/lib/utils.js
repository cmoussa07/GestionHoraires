import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function typeBadge(type) {
  switch (type) {
    case "CM":
      return "bg-yellow-100 text-amber-600";
    case "TD":
      return "bg-blue-100 text-blue-700";
    case "TP":
      return "bg-green-100 text-green-700";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

export function niveauBadge(niveau) {
  switch (niveau) {
    case "L1":
      return "bg-blue-100 text-blue-700";
    case "L2":
      return "bg-blue-200 text-blue-800";
    case "L3":
      return "bg-blue-300 text-blue-900";
    case "M1":
      return "bg-amber-100 text-amber-700";
    case "M2":
      return "bg-amber-200 text-amber-800";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

export function statutBadge(statut) {
  switch (statut) {
    case "validé":
      return "bg-green-100 text-green-700";
    case "refusé":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-500";
  }
}

export function sortHeuresDesc(heures) {
  return [...heures].sort((a, b) => {
    const dateA = new Date(a.date_cours).getTime();
    const dateB = new Date(b.date_cours).getTime();
    if (dateA !== dateB) return dateB - dateA;
    return (b.idheure || 0) - (a.idheure || 0);
  });
}
