// types/index.ts

export type Role =
  | "super_admin"
  | "president"
  | "secretaire_general"
  | "tresorier"
  | "responsable_section"
  | "membre_bureau"
  | "lecteur";

export type StatutMembre = "actif" | "inactif" | "suspendu" | "retraite" | "decede";
export type StatutCotisation = "payé" | "en_attente" | "retard" | "impayé" | "exonéré";
export type TypeCotisation = "mensuelle" | "annuelle" | "exceptionnelle" | "solidarite";
export type StatutPlainte = "ouverte" | "en_instruction" | "en_mediation" | "en_arbitrage" | "tribunal" | "resolue" | "classée" | "irrecevable";
export type StatutReunion = "planifiée" | "en_cours" | "terminée" | "annulée" | "reportée";
export type TypeAction = "greve" | "manifestation" | "negociation" | "petition" | "communique" | "sit_in" | "journee_mort" | "autre";

export interface Organisation {
  id: string;
  nom: string;
  sigle?: string;
  adresse?: string;
  telephone?: string;
  email?: string;
  pays: string;
  devise: string;
  logo_url?: string;
  created_at: string;
}

export interface Utilisateur {
  id: string;
  organisation_id: string;
  email: string;
  nom: string;
  prenom: string;
  telephone?: string;
  role: Role;
  avatar_url?: string;
  est_actif: boolean;
  derniere_connexion?: string;
}

export interface Region {
  id: string;
  organisation_id: string;
  nom: string;
  code?: string;
}

export interface Section {
  id: string;
  organisation_id: string;
  region_id?: string;
  nom: string;
  description?: string;
  est_active: boolean;
  region_nom?: string;
}

export interface Membre {
  id: string;
  organisation_id: string;
  section_id?: string;
  region_id?: string;
  numero_adherent: string;
  nom: string;
  prenom: string;
  sexe?: "M" | "F";
  date_naissance?: string;
  nationalite: string;
  numero_cni?: string;
  telephone: string;
  telephone_2?: string;
  email?: string;
  adresse?: string;
  profession?: string;
  entreprise?: string;
  poste?: string;
  date_adhesion: string;
  statut: StatutMembre;
  montant_cotisation_mensuel: number;
  photo_url?: string;
  section_nom?: string;
  region_nom?: string;
  created_at: string;
}

export interface Cotisation {
  id: string;
  organisation_id: string;
  membre_id: string;
  type_cotisation: TypeCotisation;
  montant: number;
  devise: string;
  periode_mois?: number;
  periode_annee: number;
  libelle?: string;
  date_paiement?: string;
  mode_paiement?: string;
  reference_paiement?: string;
  statut: StatutCotisation;
  note?: string;
  // Joined
  membre_nom?: string;
  membre_prenom?: string;
}

export interface Reunion {
  id: string;
  organisation_id: string;
  titre: string;
  type_reunion: string;
  date_reunion: string;
  heure_debut?: string;
  lieu?: string;
  description?: string;
  ordre_du_jour: string[];
  statut: StatutReunion;
  compte_rendu?: string;
  participants_count?: number;
}

export interface ActionSyndicale {
  id: string;
  organisation_id: string;
  titre: string;
  type_action: TypeAction;
  description?: string;
  date_debut: string;
  date_fin?: string;
  lieu?: string;
  revendications: string[];
  statut: string;
  resultat?: string;
  nombre_participants?: number;
  budget?: number;
}

export interface Plainte {
  id: string;
  organisation_id: string;
  reference: string;
  membre_declarant_id?: string;
  nom_declarant?: string;
  telephone_declarant?: string;
  entreprise_mise_en_cause?: string;
  objet: string;
  categorie: string;
  priorite: "normale" | "haute" | "urgente";
  description: string;
  statut: StatutPlainte;
  responsable_id?: string;
  date_resolution?: string;
  resultat_resolution?: string;
  historique: PlainteHistorique[];
  created_at: string;
  // Joined
  declarant_nom?: string;
  responsable_nom?: string;
}

export interface PlainteHistorique {
  date: string;
  action: string;
  utilisateur: string;
  note?: string;
}

export interface TransactionFinanciere {
  id: string;
  organisation_id: string;
  type_transaction: "recette" | "depense";
  categorie: string;
  sous_categorie?: string;
  montant: number;
  devise: string;
  date_transaction: string;
  description?: string;
  tiers?: string;
  est_valide: boolean;
}

export interface Document {
  id: string;
  organisation_id: string;
  titre: string;
  type_document: string;
  description?: string;
  fichier_url: string;
  fichier_nom?: string;
  mime_type?: string;
  est_public: boolean;
  tags: string[];
  created_at: string;
}

export interface Message {
  id: string;
  organisation_id: string;
  expediteur_id: string;
  sujet?: string;
  contenu: string;
  type_message: string;
  est_urgent: boolean;
  lu_par: string[];
  created_at: string;
  expediteur_nom?: string;
}

export interface DashboardStats {
  total_membres: number;
  membres_actifs: number;
  membres_inactifs: number;
  cotisations_annee: number;
  cotisations_mois: number;
  reunions_planifiees: number;
  plaintes_en_cours: number;
  solde_tresorerie: number;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ApiError {
  error: string;
  details?: unknown;
}
