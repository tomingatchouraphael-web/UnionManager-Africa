// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatMontant(amount: number, devise = "FCFA"): string {
  return `${amount.toLocaleString("fr-FR")} ${devise}`;
}

export function formatDate(date: string | Date, opts?: Intl.DateTimeFormatOptions): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("fr-FR", opts || {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatRelativeTime(date: string | Date): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "À l'instant";
  if (diffMins < 60) return `Il y a ${diffMins} min`;
  if (diffHours < 24) return `Il y a ${diffHours}h`;
  if (diffDays < 7) return `Il y a ${diffDays} jours`;
  return formatDate(d);
}

export function getInitials(prenom: string, nom: string): string {
  return `${prenom[0] || ""}${nom[0] || ""}`.toUpperCase();
}

export function generateNumeroAdherent(orgPrefix: string, year: number, seq: number): string {
  return `${orgPrefix}-${year}-${String(seq).padStart(4, "0")}`;
}

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validatePhone(phone: string): boolean {
  return /^(\+\d{1,3}[\s-]?)?\d{8,15}$/.test(phone.replace(/\s/g, ""));
}

export function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength) + "…";
}

export function slugify(str: string): string {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

// Couleurs d'avatar cohérentes basées sur le nom
export function getAvatarColor(name: string): string {
  const colors = [
    "from-emerald-400 to-teal-500",
    "from-blue-400 to-indigo-500",
    "from-purple-400 to-violet-500",
    "from-amber-400 to-orange-500",
    "from-red-400 to-rose-500",
    "from-cyan-400 to-sky-500",
    "from-pink-400 to-fuchsia-500",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Calcul taux de recouvrement cotisations
export function calculTauxRecouvrement(paye: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((paye / total) * 100);
}

// Formater durée d'ancienneté
export function formatAnciennete(dateAdhesion: string): string {
  const debut = new Date(dateAdhesion);
  const now = new Date();
  const diffMs = now.getTime() - debut.getTime();
  const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
  const months = Math.floor((diffMs % (365.25 * 24 * 60 * 60 * 1000)) / (30.44 * 24 * 60 * 60 * 1000));

  if (years > 0) return `${years} an${years > 1 ? "s" : ""}${months > 0 ? ` ${months} mois` : ""}`;
  if (months > 0) return `${months} mois`;
  return "Nouveau membre";
}
